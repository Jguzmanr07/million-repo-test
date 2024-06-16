from flask import Flask, render_template

app = Flask(__name__)

# Datos de la aplicación
app_info = {
    'NameSpaces': 'tech.prod',
    'Version': '1.0',
    'Description': 'Microservice in Python',
    'Maintainer': 'jguzman.07@icloud.com'
}

# Endpoint principal
@app.route('/')
def hello_world():
    return render_template('index.html', app_info=app_info)

# Endpoint de salud del servicio
@app.route('/healthz')
def health_check():
    return 'OK', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
