/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Navbar, Nav } from "react-bootstrap";
import "./App.css";
import data from "./hospital.json";

function App() {
    const [locations, setLocations] = useState({});
    const [map, setMap] = useState(null);

    const mapOptions = {
        center: {
            lat: 33.377165,
            lng: 126.533382
        },
        zoom: 10,
        zoomControl: true //줌 컨트롤의 표시 여부
    };

    useEffect(() => {
        setMap(new naver.maps.Map("map", mapOptions));
    }, []);

    const createMarker = (location, iconColor) => {
        let options = {
            position: {
                lat: location.lat,
                lng: location.lng
            },
            map: map
        };

        if (iconColor === "black" || iconColor === "green") {
            options["icon"] = {
                content:
                    '<img src="' +
                    `/images/pin_${iconColor}.png" alt="" ` +
                    'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
                    '-webkit-user-select: none; position: absolute; width: 22px; height: 35px; left: 0px; top: 0px;">',
                size: new naver.maps.Size(22, 35),
                anchor: new naver.maps.Point(11, 35)
            };
        }

        let marker = new naver.maps.Marker(options);

        const infoWindowHTML = `<div style="font-size: small; padding: 15px;"><h5>${location.이름}</h5><p>${location.주소}<br /><a href="tel:${location.전화번호}">${location.전화번호}</a></p></div>`;

        const infoWindow = new naver.maps.InfoWindow({
            content: infoWindowHTML
        });

        // mouseover event unsupported in touch devices (mobile)
        naver.maps.Event.addListener(marker, "mouseover", function(e) {
            infoWindow.open(map, marker);
        });

        naver.maps.Event.addListener(marker, "click", function(e) {
            infoWindow.open(map, marker);
        });

        setLocations(prev => {
            return {
                ...prev,
                [location.이름]: {
                    marker: marker,
                    infoWindow: infoWindow
                }
            };
        });
    };

    useEffect(() => {
        if (map) {
            data.hospital.map(location => {
                createMarker(location, "default");
            });
            data.healthCenter.map(location => {
                createMarker(location, "black");
            });
            data.ansimHospital.map(location => {
                createMarker(location, "green");
            });
        }
    }, [map]);

    const onListItemHover = location => {
        let loc = locations[location.이름];
        loc.infoWindow.open(map, loc.marker);
    };

    const listGroupItem = (location, type) => {
        return (
            <ListGroup.Item onMouseOver={() => onListItemHover(location)}>
                <h1 className="h5 font-weight-bold">
                    {location.이름}
                    <small> ({type})</small>
                </h1>
                <p className="mb-1">{location.주소}</p>
                <p className="mb-1">
                    <a href={`tel:${location.전화번호}`}>{location.전화번호}</a>
                </p>
            </ListGroup.Item>
        );
    };

    return (
        <div className="App">
            <header className="App-header">
                <Navbar bg="light" expand="lg" className="mb-3">
                    <Navbar.Brand href="#home">
                        코로나19 제주 보건소 및 지정병원
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
                </Navbar>
            </header>
            <main>
                <Container fluid>
                    <Row>
                        <Col md={4}>
                            <ListGroup
                                style={{ overflowY: "scroll", height: "85vh" }}>
                                {data.hospital.map(location => {
                                    return listGroupItem(
                                        location,
                                        "선별진료소"
                                    );
                                })}
                                {data.healthCenter.map(location => {
                                    return listGroupItem(location, "보건소");
                                })}
                                {data.ansimHospital.map(location => {
                                    return listGroupItem(
                                        location,
                                        "국민안심병원"
                                    );
                                })}
                            </ListGroup>
                        </Col>
                        <Col md={8}>
                            <div
                                id="map"
                                style={{ width: "100%", height: "85vh" }}
                            />
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    );
}

export default App;
