import pytest
from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_hello(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'Microservice in Python' in response.data
    assert b'Maintainer: jguzman.07@icloud.com' in response.data

def test_health_check(client):
    response = client.get('/healthz')
    assert response.status_code == 200
    assert response.data == b'OK'

def test_readiness_check(client):
    response = client.get('/readiness')
    assert response.status_code == 200
    assert response.data == b'OK'
