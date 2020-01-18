
INSERT INTO typ_licencji (nazwa, cena) VALUES ('Wystawowa', 0);
INSERT INTO typ_licencji (nazwa, cena) VALUES ('Czasowa', 0);
INSERT INTO typ_licencji (nazwa, cena) VALUES ('Detaliczna', 0);

CREATE OR REPLACE FUNCTION dodaj_kota(varchar, varchar, date, integer, integer default -1) RETURNS void AS'
DECLARE
t_imie ALIAS FOR $1;
t_rasa ALIAS FOR $2;
t_data_urodzenia ALIAS FOR $3;
t_wlasciciel_id ALIAS FOR $4;
t_kot_id ALIAS FOR $5;
t_rasa_id integer;
BEGIN
	IF NOT EXISTS (SELECT nazwa FROM rasy WHERE nazwa = t_rasa) THEN
		INSERT INTO rasy (nazwa) VALUES (t_rasa);
	END IF;
	t_rasa_id := (SELECT rasa_id FROM rasy WHERE nazwa = t_rasa);
	IF t_kot_id >= 0 THEN
		UPDATE koty SET imie = t_imie, rasa_id = t_rasa_id, data_urodzenia = t_data_urodzenia WHERE (wlasciciel_id = t_wlasciciel_id OR t_wlasciciel_id < 0) AND kot_id = t_kot_id;
	ELSE
		INSERT INTO koty (imie, wlasciciel_id, rasa_id, data_urodzenia) VALUES (t_imie, t_wlasciciel_id, t_rasa_id, t_data_urodzenia);
	END IF;
	RETURN;
END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION kup_bilety (integer, integer, integer default 1) RETURNS void AS'
DECLARE
t_bilet_id ALIAS FOR $1;
t_wlasciciel_id ALIAS FOR $2;
t_ilosc ALIAS FOR $3;
t_portfel float;
t_koszt float;
BEGIN
	FOR i IN 1..t_ilosc LOOP
		t_portfel :=  (SELECT portfel FROM wlasciciele WHERE wlasciciel_id = t_wlasciciel_id FOR UPDATE);
		t_koszt := (SELECT cena FROM bilety WHERE bilet_id = t_bilet_id);
		IF t_portfel >= t_koszt THEN
			UPDATE wlasciciele SET portfel=(t_portfel - t_koszt) WHERE wlasciciel_id = t_wlasciciel_id;
			INSERT INTO zakupione_bilety (bilet_id, wlasciciel_id, data) VALUES (t_bilet_id, t_wlasciciel_id, NOW());
		ELSE
			EXIT;
		END IF;
	END LOOP;
RETURN;
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION dodaj_bilet (integer, integer, float) RETURNS void AS'
DECLARE
t_wystawa_id ALIAS FOR $1;
t_typ_biletu_id ALIAS FOR $2;
t_cena ALIAS FOR $3;
BEGIN
	IF EXISTS(SELECT 1 FROM bilety WHERE wystawa_id = t_wystawa_id AND typ_biletu_id = t_typ_biletu_id) THEN
		UPDATE bilety SET cena=t_cena WHERE wystawa_id = t_wystawa_id AND typ_biletu_id = t_typ_biletu_id;
	ELSE
		INSERT INTO bilety (wystawa_id, typ_biletu_id, cena) VALUES (t_wystawa_id, t_typ_biletu_id, t_cena);
	END IF;
RETURN;
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION kup_licencje (integer, integer, integer default null, integer default null, date default null, date default null ) RETURNS void AS'
DECLARE
t_typ_licencji_id ALIAS FOR $1;
t_wlasciciel_id ALIAS FOR $2;
t_ilosc ALIAS FOR $3;
t_wydarzenie_id ALIAS FOR $4;
t_data_rozpoczecia ALIAS FOR $5;
t_data_zakonczenia ALIAS FOR $6;
t_portfel float;
t_koszt float;
t_dni float;
BEGIN
	t_portfel :=  (SELECT portfel FROM wlasciciele WHERE wlasciciel_id = t_wlasciciel_id FOR UPDATE);
	IF t_typ_licencji_id = 1 THEN
		t_koszt := (SELECT cena FROM typ_licencji WHERE typ_licencji_id = t_typ_licencji_id);
		IF t_portfel >= t_koszt THEN
			UPDATE wlasciciele SET portfel=(t_portfel - t_koszt) WHERE wlasciciel_id = t_wlasciciel_id;
			INSERT INTO licencje (typ_licencji_id, wlasciciel_id, wystawa_id) VALUES (t_typ_licencji_id, t_wlasciciel_id, t_wydarzenie_id);
		END IF;
	ELSIF t_typ_licencji_id = 2 THEN
		t_dni := (t_data_zakonczenia - t_data_rozpoczecia) + 1;
		t_koszt := (SELECT cena FROM typ_licencji WHERE typ_licencji_id = t_typ_licencji_id) * t_dni;
		IF t_portfel >= t_koszt AND t_dni >= 7 THEN
			UPDATE wlasciciele SET portfel=(t_portfel - t_koszt) WHERE wlasciciel_id = t_wlasciciel_id;
			INSERT INTO licencje (typ_licencji_id, wlasciciel_id, data_rozpoczecia, data_wygasniecia) VALUES (t_typ_licencji_id, t_wlasciciel_id, t_data_rozpoczecia, t_data_zakonczenia);
		END IF;
	ELSE
		t_koszt := (SELECT cena FROM typ_licencji WHERE typ_licencji_id = t_typ_licencji_id) * t_ilosc;
		IF t_portfel >= t_koszt AND t_ilosc >= 1 THEN
			UPDATE wlasciciele SET portfel=(t_portfel - t_koszt) WHERE wlasciciel_id = t_wlasciciel_id;
			INSERT INTO licencje (typ_licencji_id, wlasciciel_id, ilosc_sprzedazy) VALUES (t_typ_licencji_id, t_wlasciciel_id, t_ilosc);
		END IF;
	END IF;
RETURN;
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION dodaj_oferte (integer, integer, integer, integer, float, varchar default null ) RETURNS void AS $$
DECLARE
t_wlasciciel_id ALIAS FOR $1;
t_licencja_id ALIAS FOR $2;
t_wystawa_id ALIAS FOR $3;
t_kot_id ALIAS FOR $4;
t_cena ALIAS FOR $5;
t_opis ALIAS FOR $6;
t_typ integer;
t_ilosc integer;
BEGIN
	IF EXISTS(SELECT 1 FROM transakcje WHERE kot_id = t_kot_id AND data IS NULL) THEN
		RAISE EXCEPTION 'Ten kot jest już wystawiony na sprzedaż';
	END IF;
	t_typ :=  (SELECT typ_licencji_id FROM licencje WHERE wlasciciel_id = t_wlasciciel_id AND licencja_id = t_licencja_id FOR UPDATE);
	IF t_typ = 1 THEN
		IF EXISTS(SELECT 1 FROM licencje WHERE licencja_id = t_licencja_id AND wystawa_id = t_wystawa_id) THEN
			INSERT INTO transakcje (kot_id, cena, wystawa_id, opis) VALUES (t_kot_id, t_cena, t_wystawa_id, t_opis);
		END IF;
	ELSIF t_typ = 2 THEN
		IF EXISTS(SELECT 1 FROM licencje l, wystawy w WHERE l.licencja_id = t_licencja_id AND (w.data_rozpoczecia <= l.data_wygasniecia AND w.data_zakonczenia >= l.data_rozpoczecia ) AND w.wystawa_id = t_wystawa_id ) THEN
			INSERT INTO transakcje (kot_id, cena, wystawa_id, opis) VALUES (t_kot_id, t_cena, t_wystawa_id, t_opis);
		END IF;
	ELSIF t_typ = 3 THEN
		t_ilosc := (SELECT ilosc_sprzedazy FROM licencje WHERE licencja_id = t_licencja_id FOR UPDATE);
		IF t_ilosc >= 1 THEN
			UPDATE licencje SET ilosc_sprzedazy=(t_ilosc - 1) WHERE licencja_id = t_licencja_id;
			INSERT INTO transakcje (kot_id, cena, wystawa_id, opis) VALUES (t_kot_id, t_cena, t_wystawa_id, t_opis);
		END IF;
	END IF;
RETURN;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION kup_kota (integer, integer) RETURNS void AS $$
DECLARE
t_wlasciciel_id ALIAS FOR $1;
t_transakcja_id ALIAS FOR $2;
t_portfel float;
t_portfel_sprzedawcy float;
t_koszt float;
t_sprzedawca_id integer;
BEGIN
	IF NOT EXISTS(SELECT 1 FROM transakcje WHERE transakcja_id = t_transakcja_id AND data IS NULL FOR UPDATE) THEN
		RAISE EXCEPTION 'Transakcja zakończyła się lub nie istnieje';
		RETURN;
	END IF;
	t_sprzedawca_id := (SELECT k.wlasciciel_id FROM koty k, transakcje t WHERE k.kot_id = t.kot_id AND t.transakcja_id = t_transakcja_id FOR UPDATE);
	t_portfel :=  (SELECT portfel FROM wlasciciele WHERE wlasciciel_id = t_wlasciciel_id FOR UPDATE);
	t_koszt := (SELECT cena FROM transakcje WHERE transakcja_id = t_transakcja_id FOR UPDATE);
	IF t_portfel >= t_koszt THEN
		UPDATE transakcje SET data = NOW() WHERE transakcja_id = t_transakcja_id;
		UPDATE wlasciciele SET portfel=(t_portfel - t_koszt) WHERE wlasciciel_id = t_wlasciciel_id;
		t_portfel_sprzedawcy :=  (SELECT portfel FROM wlasciciele WHERE wlasciciel_id = t_sprzedawca_id FOR UPDATE);
		UPDATE wlasciciele SET portfel=(t_portfel_sprzedawcy + t_koszt) WHERE wlasciciel_id = t_sprzedawca_id;
		UPDATE koty k SET wlasciciel_id = t_wlasciciel_id FROM transakcje t WHERE t.kot_id = k.kot_id;
	ELSE
		RAISE EXCEPTION 'Niewystarczająca liczba środków na koncie';
	END IF;
RETURN;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE VIEW widok_koty AS 
SELECT k.kot_id AS "id", k.imie AS "Imię", r.nazwa AS "Rasa", k.data_urodzenia AS "Data urodzenia", w.imie || ' ' || w.nazwisko AS "Właściciel"
FROM koty k, rasy r, wlasciciele w 
WHERE k.rasa_id = r.rasa_id AND k.wlasciciel_id = w.wlasciciel_id;


CREATE OR REPLACE VIEW widok_nagrody AS 
SELECT n.nagroda_id AS "id", s.zwyciezca_id, n.konkurs_id AS "Konkurs", n.miejsce AS "Miejsce", n.opis AS "Opis",  s.imie || ' ' || s.nazwisko AS "Zwycięzca", s.kot AS "Kot"
FROM nagrody n LEFT JOIN (
	SELECT w.imie, w.nazwisko, z.nagroda_id, z.zwyciezca_id, k.imie AS "kot" 
	FROM wlasciciele w, zwyciezcy z LEFT JOIN koty k USING (kot_id)
	WHERE w.wlasciciel_id = z.wlasciciel_id
	) s 
USING (nagroda_id)
ORDER BY "id";

CREATE OR REPLACE VIEW transakcje_bilety AS 
SELECT z.zakupiony_bilet_id AS "id zakupu", z.bilet_id AS "id biletu", w.imie || ' ' || w.nazwisko AS "Właściciel", t.nazwa AS "Typ biletu", b.cena AS "Cena", z.data AS "Data zakupu"
FROM zakupione_bilety z, bilety b, typ_biletu t, wlasciciele w
WHERE b.bilet_id = z.bilet_id AND b.typ_biletu_id = t.typ_biletu_id AND z.wlasciciel_id = w.wlasciciel_id
ORDER BY "Data zakupu" DESC;

CREATE OR REPLACE VIEW widok_licencje AS 
SELECT wlasciciel_id, l.licencja_id AS "id", l.typ_licencji_id AS "typ", t.nazwa AS "Nazwa", l.ilosc_sprzedazy AS "Ilość", w.nazwa AS "Wystawa", l.data_rozpoczecia AS "Rozpoczęcie", l.data_wygasniecia AS "Wygaśnięcie"
FROM typ_licencji t, licencje l LEFT JOIN wystawy w USING (wystawa_id)  WHERE l.typ_licencji_id = t.typ_licencji_id
ORDER BY "id" DESC;

CREATE OR REPLACE VIEW widok_wlasciciele AS 
SELECT w.wlasciciel_id AS "id",  w.login AS "Login", w.imie || ' ' || w.nazwisko AS "Imię i nazwisko", w.portfel AS "Portfel", COUNT(k.kot_id) AS "Ilośc kotów"
FROM wlasciciele w LEFT JOIN koty k USING (wlasciciel_id)
GROUP BY "id"
ORDER BY "id" DESC;

CREATE OR REPLACE VIEW widok_rasy AS 
SELECT r.rasa_id AS "id", r.nazwa AS "Nazwa", COUNT(DISTINCT w.wlasciciel_id) AS "Ilość właścicieli", r.opis AS "Opis"
FROM rasy r LEFT JOIN (
	SELECT w.wlasciciel_id, k.rasa_id FROM wlasciciele w, koty k WHERE w.wlasciciel_id = k.wlasciciel_id
	) w 
USING (rasa_id)
GROUP BY "id"
ORDER BY "id" DESC;


CREATE OR REPLACE FUNCTION wyzwalacz_wlasciciele_funkcja() RETURNS TRIGGER AS $$
DECLARE
BEGIN
	NEW.imie := INITCAP(NEW.imie);
	NEW.nazwisko := INITCAP(NEW.nazwisko);
	RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER wyzwalacz_wlasciciele BEFORE INSERT OR UPDATE ON wlasciciele
FOR EACH ROW EXECUTE PROCEDURE wyzwalacz_wlasciciele_funkcja();


CREATE OR REPLACE FUNCTION wyzwalacz_daty_funkcja() RETURNS TRIGGER AS $$
DECLARE
BEGIN
	IF NEW.data_rozpoczecia > NEW.data_zakonczenia THEN
		RAISE EXCEPTION 'Data rozpoczęcia musi być przed datą zakończenia';
		RETURN NULL;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER wyzwalacz_wystawy BEFORE INSERT OR UPDATE ON wystawy
FOR EACH ROW EXECUTE PROCEDURE wyzwalacz_daty_funkcja();

CREATE TRIGGER wyzwalacz_wydarzenie BEFORE INSERT OR UPDATE ON wydarzenie
FOR EACH ROW EXECUTE PROCEDURE wyzwalacz_daty_funkcja();


