# 動画学習進捗管理アプリ

効率的な学習計画で試験対策を成功させる動画学習進捗管理アプリです。

## 機能

- **ユーザー認証**: メールアドレス + パスワードでの安全なログイン
- **学習進捗管理**: 動画の視聴状況を記録し、進捗を可視化
- **自動時間計算**: 試験日までの残り日数に基づいて、1日の必要視聴時間を自動計算
- **データ管理**: 個人のアカウントごとに学習データを安全に保存

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: PostgreSQL
- **ORM**: Drizzle ORM
- **認証**: Better-auth
- **バリデーション**: Zod
- **フォーム管理**: Conform

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd cbt-timeschedule
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example`を`.env.local`にコピーして、必要な値を設定してください：

```bash
cp .env.example .env.local
```

`.env.local`を編集：

```env
# データベース接続URL（PostgreSQL）
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Better-auth設定
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

### 4. データベースの準備

PostgreSQLデータベースを準備し、マイグレーションを実行します：

```bash
# スキーマを生成
npm run db:generate

# マイグレーション実行
npm run db:migrate

# または、開発環境では以下も使用可能
npm run db:push
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで`http://localhost:3000`を開いてアプリを確認してください。

## データベース管理

### Drizzle Studio（データベースビューア）

```bash
npm run db:studio
```

### マイグレーション

```bash
# 新しいマイグレーションファイルを生成
npm run db:generate

# マイグレーションを実行
npm run db:migrate
```

## 使用方法

1. **アカウント作成**: 初回利用時にメールアドレス、パスワード、ニックネームを入力してアカウントを作成
2. **試験日設定**: 目標となる試験日を設定
3. **動画登録**: 学習予定の動画情報（分野、詳細分野、タイトル、動画時間）を入力
4. **進捗管理**: 視聴完了した動画にチェックを入れて進捗を記録
5. **自動計算**: アプリが自動的に1日の必要視聴時間を計算して表示

## 開発

### コードフォーマット

```bash
npm run format
```

### リント

```bash
npm run lint
```

## ライセンス

This project is private.
