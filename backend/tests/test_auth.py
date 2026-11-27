from tests.utils import auth_headers, login


def test_login_ok(client):
    r = client.post(
        "/api/v1/auth/login",
        data={"username": "admin", "password": "admin123"},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


def test_login_password_incorrecta(client):
    r = client.post(
        "/api/v1/auth/login",
        data={"username": "admin", "password": "incorrecta"},
    )
    assert r.status_code == 401


def test_me_sin_token(client):
    r = client.get("/api/v1/auth/me")
    assert r.status_code == 401


def test_me_con_token(client):
    token = login(client, "admin", "admin123")
    r = client.get("/api/v1/auth/me", headers=auth_headers(token))
    assert r.status_code == 200
    assert r.json()["username"] == "admin"
