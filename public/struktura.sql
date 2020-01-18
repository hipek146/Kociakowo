
CREATE SEQUENCE projekt.typ_licencji_typ_licencji_id_seq;

CREATE TABLE projekt.Typ_licencji (
                typ_licencji_id INTEGER NOT NULL DEFAULT nextval('projekt.typ_licencji_typ_licencji_id_seq'),
                Nazwa VARCHAR NOT NULL,
                Opis VARCHAR,
				Cena REAL NOT NULL,
                CONSTRAINT typ_licencji_pk PRIMARY KEY (typ_licencji_id)
);


ALTER SEQUENCE projekt.typ_licencji_typ_licencji_id_seq OWNED BY projekt.Typ_licencji.typ_licencji_id;

CREATE SEQUENCE projekt.typ_biletu_typ_biletu_id_seq;

CREATE TABLE projekt.Typ_biletu (
                typ_biletu_id INTEGER NOT NULL DEFAULT nextval('projekt.typ_biletu_typ_biletu_id_seq'),
                Nazwa VARCHAR NOT NULL,
                Opis VARCHAR,
                CONSTRAINT typ_biletu_pk PRIMARY KEY (typ_biletu_id)
);


ALTER SEQUENCE projekt.typ_biletu_typ_biletu_id_seq OWNED BY projekt.Typ_biletu.typ_biletu_id;

CREATE SEQUENCE projekt.wystawy_wystawa_id_seq;

CREATE TABLE projekt.Wystawy (
                wystawa_id INTEGER NOT NULL DEFAULT nextval('projekt.wystawy_wystawa_id_seq'),
                Nazwa VARCHAR NOT NULL,
                Miasto VARCHAR NOT NULL,
                Adres VARCHAR NOT NULL,
                Data_rozpoczecia TIMESTAMP NOT NULL,
                Data_zakonczenia TIMESTAMP NOT NULL,
                Koszt REAL NOT NULL,
                Opis VARCHAR,
                CONSTRAINT wystawy_pk PRIMARY KEY (wystawa_id)
);


ALTER SEQUENCE projekt.wystawy_wystawa_id_seq OWNED BY projekt.Wystawy.wystawa_id;

CREATE SEQUENCE projekt.wydarzenie_wydarzenie_id_seq;

CREATE TABLE projekt.Wydarzenie (
                wydarzenie_id INTEGER NOT NULL DEFAULT nextval('projekt.wydarzenie_wydarzenie_id_seq'),
                wystawa_id INTEGER NOT NULL,
                Nazwa VARCHAR NOT NULL,
                Miejsce VARCHAR,
                Data_rozpoczecia TIMESTAMP,
                Data_zakonczenia TIMESTAMP NOT NULL,
                Opis VARCHAR,
                CONSTRAINT wydarzenie_pk PRIMARY KEY (wydarzenie_id)
);


ALTER SEQUENCE projekt.wydarzenie_wydarzenie_id_seq OWNED BY projekt.Wydarzenie.wydarzenie_id;

CREATE SEQUENCE projekt.konkursy_new_columnkonkurs_id_seq;

CREATE TABLE projekt.Konkursy (
                konkurs_id INTEGER NOT NULL DEFAULT nextval('projekt.konkursy_new_columnkonkurs_id_seq'),
                wydarzenie_id INTEGER NOT NULL,
                Nazwa VARCHAR NOT NULL,
                Opis VARCHAR,
                CONSTRAINT konkursy_pk PRIMARY KEY (konkurs_id)
);


ALTER SEQUENCE projekt.konkursy_new_columnkonkurs_id_seq OWNED BY projekt.Konkursy.konkurs_id;

CREATE SEQUENCE projekt.nagrody_nagroda_id_seq;

CREATE TABLE projekt.Nagrody (
                nagroda_id INTEGER NOT NULL DEFAULT nextval('projekt.nagrody_nagroda_id_seq'),
                Miejsce INTEGER,
                Opis VARCHAR NOT NULL,
                konkurs_id INTEGER NOT NULL,
                CONSTRAINT nagrody_pk PRIMARY KEY (nagroda_id)
);


ALTER SEQUENCE projekt.nagrody_nagroda_id_seq OWNED BY projekt.Nagrody.nagroda_id;

CREATE SEQUENCE projekt.bilety_bilet_id_seq;

CREATE TABLE projekt.Bilety (
                bilet_id INTEGER NOT NULL DEFAULT nextval('projekt.bilety_bilet_id_seq'),
                wystawa_id INTEGER NOT NULL,
                typ_biletu_id INTEGER NOT NULL,
                Cena REAL NOT NULL,
                CONSTRAINT bilety_pk PRIMARY KEY (bilet_id)
);


ALTER SEQUENCE projekt.bilety_bilet_id_seq OWNED BY projekt.Bilety.bilet_id;

CREATE SEQUENCE projekt.rasy_rasa_id_seq;

CREATE TABLE projekt.Rasy (
                rasa_id INTEGER NOT NULL DEFAULT nextval('projekt.rasy_rasa_id_seq'),
                Nazwa VARCHAR NOT NULL,
                Opis VARCHAR,
                CONSTRAINT rasy_pk PRIMARY KEY (rasa_id)
);


ALTER SEQUENCE projekt.rasy_rasa_id_seq OWNED BY projekt.Rasy.rasa_id;

CREATE SEQUENCE projekt.wlasciciele_wlasciciele_pk_seq;

CREATE TABLE projekt.Wlasciciele (
                wlasciciel_id INTEGER NOT NULL DEFAULT nextval('projekt.wlasciciele_wlasciciele_pk_seq'),
                login VARCHAR NOT NULL,
                haslo VARCHAR NOT NULL,
                Imie VARCHAR NOT NULL,
                Nazwisko VARCHAR NOT NULL,
                Portfel REAL DEFAULT 0 NOT NULL,
                CONSTRAINT wlasciciele_pk PRIMARY KEY (wlasciciel_id)
);


ALTER SEQUENCE projekt.wlasciciele_wlasciciele_pk_seq OWNED BY projekt.Wlasciciele.wlasciciel_id;

CREATE UNIQUE INDEX login
 ON projekt.Wlasciciele
 ( login );

CREATE SEQUENCE projekt.licencje_licencja_id_seq;

CREATE TABLE projekt.Licencje (
                licencja_id INTEGER NOT NULL DEFAULT nextval('projekt.licencje_licencja_id_seq'),
                wystawa_id INTEGER,
                typ_licencji_id INTEGER NOT NULL,
                Data_rozpoczecia TIMESTAMP,
                Data_wygasniecia TIMESTAMP,
                Ilosc_sprzedazy VARCHAR,
                wlasciciel_id INTEGER,
                CONSTRAINT licencje_pk PRIMARY KEY (licencja_id)
);


ALTER SEQUENCE projekt.licencje_licencja_id_seq OWNED BY projekt.Licencje.licencja_id;

CREATE SEQUENCE projekt.zakupione_bilety_zakupiony_bilet_id_seq;

CREATE TABLE projekt.Zakupione_bilety (
                zakupiony_bilet_id INTEGER NOT NULL DEFAULT nextval('projekt.zakupione_bilety_zakupiony_bilet_id_seq'),
                bilet_id INTEGER NOT NULL,
                wlasciciel_id INTEGER NOT NULL,
                Data TIMESTAMP NOT NULL,
                CONSTRAINT zakupione_bilety_pk PRIMARY KEY (zakupiony_bilet_id)
);


ALTER SEQUENCE projekt.zakupione_bilety_zakupiony_bilet_id_seq OWNED BY projekt.Zakupione_bilety.zakupiony_bilet_id;

CREATE TABLE projekt.Wystawa_Wlasciciele (
                wlasciciel_id INTEGER NOT NULL,
                wystawa_id INTEGER NOT NULL,
                CONSTRAINT wystawa_wlasciciele_pk PRIMARY KEY (wlasciciel_id, wystawa_id)
);


CREATE SEQUENCE projekt.koty_kot_id_seq;

CREATE TABLE projekt.Koty (
                kot_id INTEGER NOT NULL DEFAULT nextval('projekt.koty_kot_id_seq'),
                Imie VARCHAR NOT NULL,
                wlasciciel_id INTEGER,
                rasa_id INTEGER NOT NULL,
                Data_urodzenia DATE,
                CONSTRAINT koty_pk PRIMARY KEY (kot_id)
);


ALTER SEQUENCE projekt.koty_kot_id_seq OWNED BY projekt.Koty.kot_id;

CREATE SEQUENCE projekt.transakcje_transakcja_id_seq;

CREATE TABLE projekt.Transakcje (
                transakcja_id INTEGER NOT NULL DEFAULT nextval('projekt.transakcje_transakcja_id_seq'),
                kot_id INTEGER NOT NULL,
                Cena REAL NOT NULL,
                wystawa_id INTEGER,
                Data TIMESTAMP,
				Opis VARCHAR,
                CONSTRAINT transakcje_pk PRIMARY KEY (transakcja_id)
);

ALTER SEQUENCE projekt.transakcje_transakcja_id_seq OWNED BY projekt.transakcje.transakcja_id;

CREATE SEQUENCE projekt.zwyciezcy_zwyciezca_id_seq;

CREATE TABLE projekt.Zwyciezcy (
                zwyciezca_id INTEGER NOT NULL DEFAULT nextval('projekt.zwyciezcy_zwyciezca_id_seq'),
                wlasciciel_id INTEGER NOT NULL,
                kot_id INTEGER,
                nagroda_id INTEGER NOT NULL,
                CONSTRAINT zwyciezcy_pk PRIMARY KEY (zwyciezca_id)
);


ALTER SEQUENCE projekt.zwyciezcy_zwyciezca_id_seq OWNED BY projekt.Zwyciezcy.zwyciezca_id;

ALTER TABLE projekt.Licencje ADD CONSTRAINT typ_licencji_licencje_fk
FOREIGN KEY (typ_licencji_id)
REFERENCES projekt.Typ_licencji (typ_licencji_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Bilety ADD CONSTRAINT typ_biletu_bilety_fk
FOREIGN KEY (typ_biletu_id)
REFERENCES projekt.Typ_biletu (typ_biletu_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Wystawa_Wlasciciele ADD CONSTRAINT wystawy_wystawa_wlasciciele_fk
FOREIGN KEY (wystawa_id)
REFERENCES projekt.Wystawy (wystawa_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Transakcje ADD CONSTRAINT wystawy_transakcje_fk
FOREIGN KEY (wystawa_id)
REFERENCES projekt.Wystawy (wystawa_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Bilety ADD CONSTRAINT wystawy_bilety_fk
FOREIGN KEY (wystawa_id)
REFERENCES projekt.Wystawy (wystawa_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Wydarzenie ADD CONSTRAINT wystawy_wydarzenie_fk
FOREIGN KEY (wystawa_id)
REFERENCES projekt.Wystawy (wystawa_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Licencje ADD CONSTRAINT wystawy_licencje_fk
FOREIGN KEY (wystawa_id)
REFERENCES projekt.Wystawy (wystawa_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Konkursy ADD CONSTRAINT wydarzenie_konkursy_fk
FOREIGN KEY (wydarzenie_id)
REFERENCES projekt.Wydarzenie (wydarzenie_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Nagrody ADD CONSTRAINT konkursy_nagrody_fk
FOREIGN KEY (konkurs_id)
REFERENCES projekt.Konkursy (konkurs_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Zwyciezcy ADD CONSTRAINT nagrody_zwyciezcy_fk
FOREIGN KEY (nagroda_id)
REFERENCES projekt.Nagrody (nagroda_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Zakupione_bilety ADD CONSTRAINT bilety_zakupione_bilety_fk
FOREIGN KEY (bilet_id)
REFERENCES projekt.Bilety (bilet_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Koty ADD CONSTRAINT rasy_koty_fk
FOREIGN KEY (rasa_id)
REFERENCES projekt.Rasy (rasa_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Koty ADD CONSTRAINT wlasciciele_koty_fk
FOREIGN KEY (wlasciciel_id)
REFERENCES projekt.Wlasciciele (wlasciciel_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Wystawa_Wlasciciele ADD CONSTRAINT wlasciciele_wystawa_wlasciciele_fk
FOREIGN KEY (wlasciciel_id)
REFERENCES projekt.Wlasciciele (wlasciciel_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Zwyciezcy ADD CONSTRAINT wlasciciele_zwyciezcy_fk
FOREIGN KEY (wlasciciel_id)
REFERENCES projekt.Wlasciciele (wlasciciel_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Zakupione_bilety ADD CONSTRAINT wlasciciele_zakupione_bilety_fk
FOREIGN KEY (wlasciciel_id)
REFERENCES projekt.Wlasciciele (wlasciciel_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Licencje ADD CONSTRAINT wlasciciele_licencje_fk
FOREIGN KEY (wlasciciel_id)
REFERENCES projekt.Wlasciciele (wlasciciel_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Zwyciezcy ADD CONSTRAINT koty_zwyciezcy_fk
FOREIGN KEY (kot_id)
REFERENCES projekt.Koty (kot_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.Transakcje ADD CONSTRAINT koty_transakcje_fk
FOREIGN KEY (kot_id)
REFERENCES projekt.Koty (kot_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

CREATE TABLE administratorzy (
                login VARCHAR NOT NULL,
                haslo VARCHAR NOT NULL
);
