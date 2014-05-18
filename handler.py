from flask import Flask, render_template as r

app = Flask(__name__)

@app.route("/")
def index():
    return r('index.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=8000)