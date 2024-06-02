use oorandom::Rand64;
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_lang::solana_program::clock::Clock;
use anchor_lang::solana_program::pubkey::Pubkey;

declare_id!("HfAbERttfCFascMUn7PvwjUhD9dbepSLZ4gptE7tmwJv");

#[program]
pub mod soloto {
    use anchor_lang::solana_program::{program::invoke, system_instruction::transfer};

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let soloto: &mut Account<Soloto> = &mut ctx.accounts.soloto;
        
        let (_acc_pda, bump): (Pubkey, u8) = Pubkey::find_program_address(&[SOLOTO], ctx.program_id);

        soloto.init_winner();
        soloto.reset_players();
        soloto.init_ticket_counter();
        soloto.set_bump_counter(bump);

        // ending and duration
        let timestamp = Clock::get().unwrap().unix_timestamp as u128;
        soloto.set_ending_time(timestamp + 60);
        soloto.set_duration(60); // 1 minute

        Ok(())
    }

    pub fn add_ticket_or_payout(ctx: Context<TicketOrPayout>) -> Result<()> {
        let soloto_acc = ctx.accounts.soloto_acc.key();
        let winner = ctx.accounts.winner.key();
        let soloto_winner = ctx.accounts.soloto.winner.key();
        let amount_lamport_from_account = ctx.accounts.buyer.to_account_info().lamports();
        let soloto_pda = ctx.accounts.soloto.key();
        /* let soloto_ctx = ctx.accounts.soloto_acc.clone();
        let winner_ctx = ctx.accounts.winner.clone(); */

        require_keys_eq!(soloto_acc, soloto_pda, ErrorCode::SolotoMismatch);
        require_keys_eq!(soloto_winner, winner, ErrorCode::WinnerMismatch);

        let soloto = &mut ctx.accounts.soloto;
        
        // if No winner selected yet, we check if it has expired. if not expired, buy ticket. otherwise assign winner and send price
        if soloto.winner == system_program::ID {

            let timestamp = Clock::get().unwrap().unix_timestamp as u128;

            if timestamp > soloto.ending_time {
                soloto.choose_winner().expect("Failed while choosing the winner");

                return Ok(())
            }

            let ticket_price: u64 = 100_000_000; // 0,1 SOL
            require_gte!(amount_lamport_from_account, ticket_price, ErrorCode::InsufficientFunds);
            let buyer = ctx.accounts.buyer.key();

            invoke(
                &transfer(
                    &buyer, 
                    &soloto_pda, 
                    ticket_price
                ), &[
                    ctx.accounts.buyer.to_account_info(),
                    ctx.accounts.soloto_acc.to_account_info()
                ]
            ).expect("Failed while transferring sol to buy the ticket");

            soloto.players.push(buyer);
            soloto.plus_ticket_counter();

            
        } 

        return Ok(())

    }
}

#[derive(Accounts)]
pub struct Initialize<'info>  {
    #[account(init, seeds = [SOLOTO], bump, payer = user, space = Soloto::SIZE)]
    pub soloto: Account<'info, Soloto>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TicketOrPayout<'info> {
    #[account(mut, seeds = [SOLOTO], bump = soloto.bump_counter, )]
    pub soloto: Account<'info, Soloto>,
    #[account(mut, signer)]
    /// CHECK: The buyer account is used as a signer to authorize the transaction
    pub buyer: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: This account is validated by the program logic to ensure it is the correct Soloto account
    pub soloto_acc: AccountInfo<'info>,
    /// CHECK: This account is validated by the program logic to ensure it is the correct winner account
    pub winner: AccountInfo<'info>,
    pub system_program: Program<'info, System>
}

#[account]
pub struct Soloto {
    pub players: Vec<Pubkey>,
    pub winner: Pubkey,
    pub ending_time: u128,
    pub tickets_counter: u64,
    pub duration: u64,
    pub bump_counter: u8,
}

impl Soloto {
    pub const SIZE: usize = 8 + (32 * MAX_TICKETS) + 32 + 16 + 8 + 8 +  1 + ANCHOR_BUFFER;

    pub fn plus_ticket_counter(&mut self) {
        self.tickets_counter += 1;
    }

    pub fn init_winner(&mut self) {
        self.winner = system_program::ID;
    }

    pub fn set_winner(&mut self, winner: Pubkey) {
        self.winner = winner;
    }

    pub fn reset_players(&mut self) {
        self.players = [].to_vec();
    }

    pub fn init_ticket_counter(&mut self) {
        self.tickets_counter = 0;
    }

    pub fn set_duration(&mut self, duration: u64) {
        self.duration = duration;
    }

    pub fn set_ending_time(&mut self, ending_time: u128) {
        self.ending_time = ending_time;
    }

    pub fn set_bump_counter(&mut self, bump_counter: u8) {
        self.bump_counter = bump_counter;
    }

    pub fn choose_winner(&mut self) -> Result<()> {
        // number of players
        let num_players = self.players.len() as u64;

        // timestamp
        let timestamp = Clock::get().unwrap().unix_timestamp as u128;

        // random number
        let mut rng = Rand64::new(timestamp);
        let index: usize = rng.rand_range(0..num_players).try_into().unwrap();

        // 
        let winner = self.players[index];
        self.set_winner(winner);
        
        Ok(())
    }

    pub fn pay_to_winner(
        &mut self,
        soloto_ctx: AccountInfo,
        winner_ctx: AccountInfo,
    ) -> Result<()> {
        let payment = self.players.len() as u64;

        // Pay and reset
        **soloto_ctx.to_account_info().try_borrow_mut_lamports()? -= payment;
        **winner_ctx.to_account_info().try_borrow_mut_lamports()? += payment;

        self.reset_players();
        self.init_winner();
        self.init_ticket_counter();
        
        // timestamp
        let timestamp = Clock::get().unwrap().unix_timestamp as u128;
        self.set_ending_time(timestamp + self.duration as u128);

        Ok(())
    }


}

pub const SOLOTO: &[u8; 6] = b"soloto";
pub const MAX_TICKETS: usize = 300;
pub const ANCHOR_BUFFER: usize = 8;

// Custom error codes for better error handling
#[error_code]
pub enum ErrorCode {
    #[msg("Soloto account does not match the expected PDA.")]
    SolotoMismatch,
    #[msg("Winner account does not match the expected winner.")]
    WinnerMismatch,
    #[msg("Insufficient funds to buy a ticket.")]
    InsufficientFunds,
}