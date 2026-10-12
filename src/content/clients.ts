import type { StaticImageData } from "next/image";
import abtTrans from "@/assets/clients/abt-trans.png";
import arcaSeniorilor from "@/assets/clients/arca-seniorilor.png";
import coolinaria from "@/assets/clients/coolinaria.png";
import doctorUsi from "@/assets/clients/doctor-usi.png";
import forajeApa from "@/assets/clients/foraje-apa.png";
import goldenHands from "@/assets/clients/golden-hands.png";
import helios from "@/assets/clients/helios.webp";
import luxuraInvest from "@/assets/clients/luxura-invest.png";
import mvpDesign from "@/assets/clients/mvp-design.png";
import ozon from "@/assets/clients/ozon.png";
import remotrail from "@/assets/clients/remotrail.png";
import somInVia from "@/assets/clients/som-in-via.png";

export type Client = {
  name: string;
  logo: StaticImageData | { src: string; width: number; height: number };
  /** Visual footprint used to balance logos of very different proportions. */
  shape: "wide" | "medium" | "square";
  /** Pale artwork (gold, light grey) gets extra contrast in the greyscale wall. */
  pale?: boolean;
};

/** Client logos shown on the original homepage ("Hai să vezi cu cine am lucrat"). */
export const clients: Client[] = [
  { name: "Luxura Invest", logo: luxuraInvest, shape: "wide" },
  { name: "Helios", logo: helios, shape: "wide" },
  { name: "Doctor Uși Cluj 24", logo: doctorUsi, shape: "medium" },
  { name: "Wine District", logo: { src: "/media/clients/wine-district.svg", width: 510, height: 102 }, shape: "wide", pale: true },
  { name: "Coolinaria", logo: coolinaria, shape: "square" },
  { name: "SOM in Via", logo: somInVia, shape: "square" },
  { name: "Foraje apă", logo: forajeApa, shape: "square" },
  { name: "MVP Design", logo: mvpDesign, shape: "medium" },
  { name: "Golden Hands Salon", logo: goldenHands, shape: "wide", pale: true },
  { name: "Ozon", logo: ozon, shape: "square" },
  { name: "Arca Seniorilor", logo: arcaSeniorilor, shape: "medium" },
  { name: "RemoTrail", logo: remotrail, shape: "wide" },
  { name: "ABT Trans", logo: abtTrans, shape: "medium" },
];
