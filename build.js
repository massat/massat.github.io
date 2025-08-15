const fs = require('fs-extra');
const { marked } = require('marked');
const path = require('path');

// HTMLテンプレート
const htmlTemplate = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fafafa;
        }
        
        .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        
        h2 {
            color: #34495e;
            margin-top: 35px;
            margin-bottom: 15px;
            border-left: 4px solid #3498db;
            padding-left: 15px;
        }
        
        h3 {
            color: #2c3e50;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        
        th {
            background-color: #f8f9fa;
            font-weight: 600;
        }
        
        ul, ol {
            margin: 15px 0;
            padding-left: 25px;
        }
        
        li {
            margin-bottom: 5px;
        }
        
        strong {
            color: #2c3e50;
        }
        
        em {
            color: #7f8c8d;
        }
        
        a {
            color: #3498db;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        .contact {
            background-color: #ecf0f1;
            padding: 20px;
            border-radius: 5px;
            margin: 30px 0;
        }
        
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .container {
                padding: 20px;
            }
            
            table {
                font-size: 14px;
            }
            
            th, td {
                padding: 8px;
            }
        }
        
        .skills-section {
            margin: 30px 0;
        }
        
        .experience-item {
            margin-bottom: 30px;
            padding: 20px;
            border-left: 4px solid #27ae60;
            background-color: #f8f9fa;
            border-radius: 0 5px 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        {{content}}
    </div>
</body>
</html>`;

async function buildSite() {
    try {
        // distディレクトリを作成
        await fs.ensureDir('dist');
        
        // Markdownファイルを読み込み
        const markdownContent = await fs.readFile('src/index.md', 'utf-8');
        
        // MarkdownをHTMLに変換
        const htmlContent = marked(markdownContent);
        
        // タイトルを抽出（最初のh1から）
        const titleMatch = markdownContent.match(/^# (.+)/m);
        const title = titleMatch ? titleMatch[1] : 'Portfolio - Masato Hirai';
        
        // テンプレートにコンテンツを挿入
        const finalHtml = htmlTemplate
            .replace('{{title}}', title)
            .replace('{{content}}', htmlContent);
        
        // HTMLファイルを出力
        await fs.writeFile('dist/index.html', finalHtml);
        
        console.log('✅ ビルドが完了しました!');
        console.log('📂 出力先: dist/index.html');
        
    } catch (error) {
        console.error('❌ ビルドエラー:', error);
        process.exit(1);
    }
}

// ビルド実行
buildSite();