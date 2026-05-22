// WebSocketのライブラリを読み込む
const WebSocket = require("ws");

// WebSocetのサーバー起動
const wss = new WebSocket.Server({ port: 3000 });

// サーバーに接続する人(クライアント)の集合を定義
const clients = new Set();

// 接続されたときに呼ばれる関数を登録
wss.on("connection", (ws) => {
    console.log("ユーザー接続");
    clients.add(ws);

    // この名前は初期値で、実際に使われることはない
    ws.name = "nanasi";

    ws.on("message", (message) => {
        console.log("受信データ:", message.toString());

        let data;        
        try {
            // 文字列をオブジェクトに変換
            data = JSON.parse(message);
        } catch (e) {
            console.log("JSONパース失敗");
            return;
        }

        // チャット送信
        // 誰かが送ったメッセージを
        if(data.type === "chat"){
            for(const client of clients){
                // 全員に送っている
                client.send(`${data.name}: ${data.message}`);
            }
        }
    });

    ws.on("close", () => {
        console.log("ユーザー切断");
        clients.delete(ws);
    });
});

console.log("サーバー起動: port 3000");