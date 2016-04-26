FORMAT: 1A

# Test API Blueprint

Test API Blueprint for ```api-blueprint-json-schema```.

Request and response payloads include data schemas, to the [JSON schema spec](http://json-schema.org/).

# Group Test resource

Authentication operations.

## Test [/test/{id}/something?niceParameter={niceParameter}]

+ Parameters

    + id (required, string) ... Test ```id```

### Retrieve [POST]

Retrieve test data.

+ Request

    + Body

            {
              "name": "G.O.B.",
              "noiseAChickenMakes": "Caw! Ca-caw!"
            }

    + Schema

            {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "title": "/test/{id}/something POST request",
              "type": "object",
              "required": [
                "name",
                "noiseAChickenMakes"
              ],
              "properties": {
                "name": {
                  "description": "Name.",
                  "type": "string"
                },
                "noiseAChickenMakes": {
                  "description": "Valid chicken noise.",
                  "type": "string",
                  "enum": [ "Caw! Ca-caw!", "A-coodle-doodle-do!", "Chee-chaw!", "Coo-coo-ca-chaw!" ]
                }
              },
              "additionalProperties": false
            }

+ Response 201

    + Body

            {
              "name": "G.O.B.",
              "noiseAChickenMakes": "Caw! Ca-caw!"
            }

    + Schema

            {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "title": "/test/{id}/something POST 201 response",
              "type": "object",
              "required": [
                "name",
                "noiseAChickenMakes"
              ],
              "properties": {
                "name": {
                  "description": "Name.",
                  "type": "string"
                },
                "noiseAChickenMakes": {
                  "description": "Valid chicken noise.",
                  "type": "string"
                }
              }
            }

+ Response 400

+ Response 500

    + Schema

            {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "title": "/test/{id} POST 500 response",
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
