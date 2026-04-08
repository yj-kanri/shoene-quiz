# 2026年 省エネ住宅補助金 問題集サイト

GitHub Pages でそのまま公開できる、静的な学習サイトです。

## ファイル構成

```text
shoene-quiz-site/
├─ index.html
├─ style.css
├─ script.js
├─ data/
│  └─ questions.js
└─ README.md
```

## できること

- 2026年の住宅省エネ補助金をカテゴリ別に学習
- 10問、20問、30問、全問で出題数を変更
- ランダム出題
- 間違えた問題だけ再挑戦
- 各問題に解説と参考元リンクを表示

## GitHub Pages 公開手順

### 方法1 いちばん簡単

1. GitHubで新しいリポジトリを作成
2. このフォルダ内のファイルをそのままアップロード
3. GitHub の `Settings` を開く
4. `Pages` を開く
5. `Deploy from a branch` を選ぶ
6. Branch は `main`、フォルダは `/ (root)` を選ぶ
7. 保存
8. 数分後に公開URLが発行される

### 方法2 Gitでアップロード

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin あなたのリポジトリURL
git push -u origin main
```

その後、GitHub の `Settings > Pages` で `main / root` を指定してください。

## カスタマイズ方法

### 問題を追加したい

`data/questions.js` の配列に、以下の形式で追加してください。

```js
{
  category: "カテゴリ名",
  question: "問題文",
  choices: ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  answer: 0,
  explanation: "解説",
  sourceLabel: "参考元の表示名",
  sourceUrl: "https://example.com"
}
```

`answer` は、正解の選択肢番号です。
0が1番目、1が2番目、2が3番目、3が4番目です。

## 運用上の注意

- 制度は更新されることがあります
- 公開後も、定期的に公式サイトの新着情報を確認してください
- 最終判断は、必ず最新の公式資料で行ってください

## 主な参考元

- 住宅省エネ2026キャンペーン 公式
- みらいエコ住宅2026事業 公式
- 先進的窓リノベ2026事業 公式
- 給湯省エネ2026事業 公式
- 賃貸集合給湯省エネ2026事業 公式
