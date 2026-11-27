import app.routers.reels as reels_mod


def test_crear_y_listar_reel(client, monkeypatch):
    monkeypatch.setattr(reels_mod, "generar_reel", lambda reel_id: None)

    r = client.post(
        "/api/v1/reels",
        json={"tema": "¿Por qué flotan los barcos?", "nivel": "primaria"},
    )
    assert r.status_code == 201
    body = r.json()
    assert body["status"] == "pending"
    assert body["tema"] == "¿Por qué flotan los barcos?"

    r2 = client.get("/api/v1/reels")
    assert r2.status_code == 200
    assert any(x["id"] == body["id"] for x in r2.json())


def test_video_no_disponible(client, monkeypatch):
    monkeypatch.setattr(reels_mod, "generar_reel", lambda reel_id: None)

    r = client.post("/api/v1/reels", json={"tema": "La fotosíntesis", "nivel": "secundaria"})
    reel_id = r.json()["id"]

    r2 = client.get(f"/api/v1/reels/{reel_id}/video")
    assert r2.status_code == 409
