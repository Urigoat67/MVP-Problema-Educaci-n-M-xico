from tests.utils import auth_headers, login


def _crear_plantel(client, token):
    r = client.post(
        "/api/v1/planteles",
        json={"nombre": "Escuela Sol", "clave": "SOL001"},
        headers=auth_headers(token),
    )
    assert r.status_code == 201, r.text
    return r.json()


def _crear_docente(client, token, plantel_id):
    r = client.post(
        "/api/v1/users",
        json={
            "nombre_completo": "Profe Demo",
            "username": "docente.sol",
            "password": "claveSegura1",
            "rol": "docente",
            "plantel_id": plantel_id,
        },
        headers=auth_headers(token),
    )
    assert r.status_code == 201, r.text
    return r.json()


def test_flujo_roles(client):
    token_admin = login(client, "admin", "admin123")

    plantel = _crear_plantel(client, token_admin)
    _crear_docente(client, token_admin, plantel["id"])

    # El docente no puede crear planteles.
    token_docente = login(client, "docente.sol", "claveSegura1")
    r = client.post(
        "/api/v1/planteles",
        json={"nombre": "Otra", "clave": "OTRA001"},
        headers=auth_headers(token_docente),
    )
    assert r.status_code == 403

    # El docente solo ve usuarios de su plantel.
    r = client.get("/api/v1/users", headers=auth_headers(token_docente))
    assert r.status_code == 200
    assert {u["username"] for u in r.json()} == {"docente.sol"}

    # El admin sí ve a todos.
    r = client.get("/api/v1/users", headers=auth_headers(token_admin))
    assert r.status_code == 200
    assert {u["username"] for u in r.json()} == {"admin", "docente.sol"}


def test_usuario_duplicado(client):
    token = login(client, "admin", "admin123")
    r = client.post(
        "/api/v1/users",
        json={
            "nombre_completo": "Duplicado",
            "username": "admin",
            "password": "claveSegura1",
            "rol": "docente",
        },
        headers=auth_headers(token),
    )
    assert r.status_code == 409
