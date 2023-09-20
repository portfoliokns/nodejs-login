# このリポジトリについて
これはフォーム認証を実現するためののサンプルのリポジトリです。

# 実装機能
- フォーム認証
  - ユーザーがIDとパスワードをもとに、認証できる機能
- セッション管理機能
  - ログインユーザーのセッションを管理する機能
- ユーザー登録機能
  - ユーザーを新規登録できる機能
- mongoDBとの連携機能
  - mongoDBへ情報を保存したり、情報を参照するための機能

# インストールしているモジュール
- nodemon
  - コード変更後、自動でアプリケーションを再起動するモジュール
- express
  - ビュー（ejsファイル）を使用するためにインストールしているモジュール
- express-session
  - ユーザーのログインを制御するための、セッション用モジュール
- express-validator
  - 情報をmongoDBへ保存する前に、バリデーションチェックをおこなうためのモジュール
- mongoose
  - mongoDBへの接続を行うために必要なモジュール
- bcrypt
  - ユーザーのパスワードをハッシュ化、照合するためのモジュール
- ejs
  テンプレートエンジン（部分テンプレート）を利用するためのモジュール

# 仕様
- ログインページ
  - IDとパスワードでユーザーログインすることができます。
  - ログイン後、ログインユーザーのみ使用できるページを閲覧できます。
  - ログイン後、一定の時間が経過するとログアウト状態となります。
- ユーザー新規登録ページ
  - 名前、メールアドレス、パスワードを入力し、登録することで、ユーザーを新規追加することができます。
  - 追加したユーザー情報はmongoDBへ保存されます。
  - 追加後、そのユーザーとしてログインした状態になります。
  - ログイン後、一定の時間が経過するとログアウト状態となります。
- ユーザー情報閲覧ページ
  - ログインしたユーザーが自身のユーザー情報を閲覧できます。
- その他
  - 存在しないページへアクセスしたり、ログインしていないユーザーがログイン後のページへアクセスされないようにリダイレクト機能を設けています。（不正アクセス対策）

# 起動方法
ターミナル上で、以下のようにサーバーを起動する
```:例
npm start
```

# 学んだこと
- ejsをインストールし、モジュールを使用することでテンプレートエンジン（部分テンプレート）を使用することができるということ。
- mongoDBへの接続はmongooseを使用すること
- mongoDBへの接続を成功させるためには、ユーザー認証の成功だけでなく、IPアドレスを事前に登録しておく必要がある。（IPアドレス未登録の場合、mongoDB側からネットワークアクセスが拒否される）
- バリデーションはexpress-validatorを使用すること
- 存在しないパスを指定されたとしても、リダイレクト機能を応用して、存在しないページへ案内することができること
