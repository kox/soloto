/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/soloto.json`.
 */
export type Soloto = {
  "address": "HfAbERttfCFascMUn7PvwjUhD9dbepSLZ4gptE7tmwJv",
  "metadata": {
    "name": "soloto",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addTicketOrPayout",
      "discriminator": [
        204,
        252,
        36,
        63,
        101,
        80,
        186,
        189
      ],
      "accounts": [
        {
          "name": "soloto",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  111,
                  116,
                  111
                ]
              }
            ]
          }
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "solotoAcc",
          "writable": true
        },
        {
          "name": "winner"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "soloto",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  111,
                  116,
                  111
                ]
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "soloto",
      "discriminator": [
        127,
        104,
        34,
        159,
        130,
        19,
        67,
        6
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "solotoMismatch",
      "msg": "Soloto account does not match the expected PDA."
    },
    {
      "code": 6001,
      "name": "winnerMismatch",
      "msg": "Winner account does not match the expected winner."
    },
    {
      "code": 6002,
      "name": "insufficientFunds",
      "msg": "Insufficient funds to buy a ticket."
    }
  ],
  "types": [
    {
      "name": "soloto",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "players",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "winner",
            "type": "pubkey"
          },
          {
            "name": "endingTime",
            "type": "u128"
          },
          {
            "name": "ticketsCounter",
            "type": "u64"
          },
          {
            "name": "duration",
            "type": "u64"
          },
          {
            "name": "bumpCounter",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
