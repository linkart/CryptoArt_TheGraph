import {KnownOriginDigitalAssetV2} from "../../generated/KnownOriginDigitalAssetV2/KnownOriginDigitalAssetV2";
import {Address} from "@graphprotocol/graph-ts/index";
import {KODA_MAINNET, KODA_RINKEBY} from "./constants";

export function getKnownOriginV2ForAddress(address: Address): KnownOriginDigitalAssetV2 {

    let mainnetAddresses = new Array<Address>();
    mainnetAddresses.push(Address.fromString("0xdde2d979e8d39bb8416eafcfc1758f3cab2c9c72")) // KODA v1
    mainnetAddresses.push(Address.fromString("0xfbeef911dc5821886e1dda71586d90ed28174b7d")) // KODA V2
    mainnetAddresses.push(Address.fromString("0x921ade9018Eec4a01e41e80a7eeBa982B61724Ec")) // auction V1
    mainnetAddresses.push(Address.fromString("0x848b0ea643e5a352d78e2c0c12a2dd8c96fec639")) // auction V2
    mainnetAddresses.push(Address.fromString("0xc1697d340807324200e26e4617Ce9c0070488E23")) // token marketplace V1
    mainnetAddresses.push(Address.fromString("0xc322cdd03f34b6d25633c2abbc8716a058c7fe9e")) // token marketplace V2
    mainnetAddresses.push(Address.fromString("0xcc0b7707ba4d7d7f9acdd16ab2e0b1997e816166")) // artist burner V1
    mainnetAddresses.push(Address.fromString("0x5327cf8b4127e81013d706330043e8bf5673f50d")) // artist tools v2

    // Mainnet addresses
    if (mainnetAddresses.indexOf(address) > -1) {
        return KnownOriginDigitalAssetV2.bind(Address.fromString(KODA_MAINNET))
    }

    return KnownOriginDigitalAssetV2.bind(Address.fromString(KODA_RINKEBY))
}
