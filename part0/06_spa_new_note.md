```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Request: {"content":"hallo","date":"2025-12-19"}
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: HTTP/1.1 201 Created
    deactivate server

    Note left of server: The server doesn't ask for a redirect

    Note right of browser: The browser stays on the same page and sends no further HTTP requests
```
