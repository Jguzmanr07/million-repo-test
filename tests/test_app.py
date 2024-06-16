import pytest
from bs4 import BeautifulSoup
from app import app

@pytest.fixture
def client():
    """Fixture para obtener un cliente de prueba para la aplicación."""
    with app.test_client() as client:
        yield client

def test_hello(client):
    """Prueba del endpoint principal '/'."""
    response = client.get('/')
    assert response.status_code == 200

    # Decodificar el contenido HTML de la respuesta
    html_content = response.data.decode('utf-8')

    # Utilizar BeautifulSoup para analizar el contenido HTML
    soup = BeautifulSoup(html_content, 'html.parser')

    # Buscar el mantenimiento en el contenido HTML
    maintainer_info = soup.find('strong', string='Maintainer:')
    assert maintainer_info is not None
    assert 'jguzman.07@icloud.com' in maintainer_info.parent.text

def test_health_check(client):
    """Prueba del endpoint '/healthz'."""
    response = client.get('/healthz')
    assert response.status_code == 200
    assert response.data == b'OK'

