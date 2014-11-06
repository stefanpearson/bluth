FORMAT: 1A

# Test API Blueprint

Test API Blueprint for ```api-blueprint-json-schema```.

Request and response payloads include data schemas, to the [JSON schema spec](http://json-schema.org/).

# Group Test resource

Authentication operations.

## Test [/test/{id}?niceParameter={niceParameter}]

+ Parameters

    + id (required, string) ... Test ```id```

### Retrieve [GET]

Retrieve test data.

+ Request

    + Body

            {
              "name": "Lionel Rich-Tea",
              "isDancingOnTheCeiling": true
            }

    + Schema

            {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "title": "/test/{id} GET request",
              "type": "object",
              "required": [
                "name"
              ],
              "properties": {
                "name": {
                  "description": "Biscuit/Motown pun.",
                  "type": "string"
                },
                "isDancingOnTheCeiling": {
                  "description": "Is the user dancing on the ceiling?",
                  "type": "boolean"
                }
              }
            }

+ Response 200

    + Body

            {
              "message": "Oh, what a feeling!"
            }

    + Schema

            {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "title": "/test/{id} GET 200 response",
              "type": "object",
              "required": [
                "message"
              ],
              "properties": {
                "message": {
                  "description": "Hello.",
                  "type": "string"
                }
              }
            }

+ Response 400

+ Response 500

    + Schema

            {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "title": "/test/{id} GET 500 response",
              "type": "object",
              "required": [
                "stackTrace"
              ],
              "properties": {
                "stackTrace": {
                  "description": "Server stack trace.",
                  "type": "string"
                }
              }
            }
