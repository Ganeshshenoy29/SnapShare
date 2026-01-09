const express = require("express");

const router = express.Router();

router.get("/:id", (req, res) => {

    const id = req.params.id;
const filename = global.fileStore.get(id);

if (!filename) {
    return res.status(404).send("Invalid or expired link");
}


    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Download File - ${filename}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .container {
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    padding: 40px;
                    max-width: 500px;
                    width: 100%;
                    text-align: center;
                    animation: slideUp 0.5s ease;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .icon {
                    font-size: 80px;
                    margin-bottom: 20px;
                    animation: bounce 1s ease;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                h2 {
                    color: #333;
                    margin-bottom: 15px;
                    font-size: 28px;
                }

                .subtitle {
                    color: #666;
                    margin-bottom: 30px;
                    font-size: 16px;
                }

                .file-card {
                    background: #f8f9ff;
                    border: 2px solid #e8ebff;
                    border-radius: 15px;
                    padding: 25px;
                    margin-bottom: 30px;
                    transition: all 0.3s ease;
                }

                .file-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
                }

                .file-icon {
                    font-size: 50px;
                    margin-bottom: 15px;
                }

                .filename-label {
                    color: #999;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                }

                .filename {
                    color: #333;
                    font-size: 18px;
                    font-weight: 600;
                    word-break: break-all;
                    line-height: 1.4;
                }

                .btn-download {
                    width: 100%;
                    padding: 16px;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .btn-download:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
                }

                .btn-download:active {
                    transform: translateY(-1px);
                }

                .btn-download::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    transition: left 0.5s ease;
                }

                .btn-download:hover::before {
                    left: 100%;
                }

                .info-section {
                    margin-top: 30px;
                    padding-top: 30px;
                    border-top: 2px solid #f0f0f0;
                }

                .info-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 10px;
                }

                .info-icon {
                    font-size: 18px;
                }

                .download-icon {
                    display: inline-block;
                    margin-right: 8px;
                }

                @media (max-width: 600px) {
                    .container {
                        padding: 30px 20px;
                    }

                    h2 {
                        font-size: 24px;
                    }

                    .icon {
                        font-size: 60px;
                    }

                    .file-icon {
                        font-size: 40px;
                    }

                    .filename {
                        font-size: 16px;
                    }
                }

                .loading {
                    display: none;
                    margin-top: 15px;
                    color: #667eea;
                    font-size: 14px;
                }

                .loading.show {
                    display: block;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .spinner {
                    display: inline-block;
                    margin-left: 8px;
                    animation: spin 1s linear infinite;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">📦</div>
                
                <h2>Your file is ready!</h2>
                <p class="subtitle">Click the button below to download your file</p>

                <div class="file-card">
                    <div class="file-icon">📄</div>
                    <div class="filename-label">Filename</div>
                    <div class="filename" id="filename">${filename}</div>
                </div>

                <a href="/download/${id}" class="btn-download">
                    <span class="download-icon">⬇️</span>
                    Download File
                </a>

                <div class="loading" id="loading">
                    Preparing download<span class="spinner">⏳</span>
                </div>

                <div class="info-section">
                    <div class="info-item">
                        <span class="info-icon">🔒</span>
                        <span>Secure download</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">⚡</span>
                        <span>Fast and reliable</span>
                    </div>
                </div>
            </div>

            <script>
                // Add download click handler for visual feedback
                document.getElementById('downloadBtn').addEventListener('click', function(e) {
                    const loading = document.getElementById('loading');
                    loading.classList.add('show');
                    
                    // Hide loading after a short delay
                    setTimeout(() => {
                        loading.classList.remove('show');
                    }, 2000);
                });

                // Copy filename functionality (optional enhancement)
                document.getElementById('filename').addEventListener('click', async function() {
                    const filename = this.textContent;
                    try {
                        await navigator.clipboard.writeText(filename);
                        const originalText = this.textContent;
                        this.textContent = '✓ Copied!';
                        this.style.color = '#4caf50';
                        
                        setTimeout(() => {
                            this.textContent = originalText;
                            this.style.color = '#333';
                        }, 2000);
                    } catch (err) {
                        console.log('Copy failed');
                    }
                });

                // Add keyboard shortcut for download (Enter key)
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        document.getElementById('downloadBtn').click();
                    }
                });

                // Add dynamic file icon based on extension
                function getFileIcon(filename) {
                    const ext = filename.split('.').pop().toLowerCase();
                    const icons = {
                        'pdf': '📕',
                        'doc': '📘',
                        'docx': '📘',
                        'txt': '📝',
                        'zip': '🗜️',
                        'rar': '🗜️',
                        'jpg': '🖼️',
                        'jpeg': '🖼️',
                        'png': '🖼️',
                        'gif': '🖼️',
                        'mp4': '🎬',
                        'mp3': '🎵',
                        'wav': '🎵',
                        'exe': '⚙️',
                        'apk': '📱',
                        'xls': '📊',
                        'xlsx': '📊',
                        'ppt': '📊',
                        'pptx': '📊'
                    };
                    return icons[ext] || '📄';
                }

                // Set the appropriate file icon
                const filename = document.getElementById('filename').textContent;
                document.querySelector('.file-icon').textContent = getFileIcon(filename);
            </script>
        </body>
        </html>
    `);
});

module.exports = router;