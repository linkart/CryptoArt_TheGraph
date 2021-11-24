import {
    AuctionEnabled,
    BidPlaced,
    BidAccepted,
    BidRejected,
    BidWithdrawn,
    BidIncreased,
    BidderRefunded,
    AuctionCancelled,
} from "../../generated/ArtistAcceptingBidsV2/ArtistAcceptingBidsV2";

import {MAX_UINT_256, ONE} from "../utils/constants";

import {toEther} from "../utils/utils";
import {getArtistAddress} from "../services/AddressMapping.service";
import {getKnownOriginV2ForAddress} from "../utils/KODAV2AddressLookup";

import * as EVENT_TYPES from "../utils/EventTypes";
import * as SaleTypes from "../utils/SaleTypes";

import * as editionService from "../services/Edition.service";
import * as artistService from "../services/Artist.service";
import * as dayService from "../services/Day.service";
import * as auctionEventFactory from "../services/AuctionEvent.factory";
import * as auctionEventService from "../services/AuctionEvent.service";
import * as collectorService from "../services/Collector.service";
import * as offerService from "../services/Offers.service";
import * as tokenService from "../services/Token.service";
import * as activityEventService from "../services/ActivityEvent.service";

export function handleAuctionCancelled(event: AuctionCancelled): void {
    /*
      event AuctionCancelled(
        uint256 indexed _editionNumber
      );
    */
    let contract = getKnownOriginV2ForAddress(event.address)
    let editionEntity = editionService.loadOrCreateV2Edition(event.params._editionNumber, event.block, contract)
    editionEntity.auctionEnabled = false
    editionEntity.offersOnly = false
    editionEntity.salesType = SaleTypes.BUY_NOW
    editionEntity.save()

    auctionEventService.removeActiveBidOnEdition(event.params._editionNumber)

    offerService.clearEditionOffer(event.block, event.params._editionNumber)
}

export function handleBidPlaced(event: BidPlaced): void {
    /*
      event BidPlaced(
        address indexed _bidder,
        uint256 indexed _editionNumber,
        uint256 _amount
      );
    */
    let contract = getKnownOriginV2ForAddress(event.address)
    let editionEntity = editionService.loadOrCreateV2Edition(event.params._editionNumber, event.block, contract)

    let auctionEvent = auctionEventFactory.createBidPlacedEvent(event.block, event.transaction, editionEntity, event.params._bidder, event.params._amount);
    auctionEvent.save()

    let biddingHistory = editionEntity.biddingHistory
    biddingHistory.push(auctionEvent.id.toString())
    editionEntity.biddingHistory = biddingHistory
    editionEntity.save()

    dayService.recordDayBidPlacedCount(event)

    dayService.recordDayTotalValueCycledInBids(event, event.params._amount)
    dayService.recordDayTotalValuePlaceInBids(event, event.params._amount)

    auctionEventService.recordActiveEditionBid(event.params._editionNumber, auctionEvent)

    offerService.recordEditionOffer(event.block, event.transaction, event.params._bidder, event.params._amount, null, event.params._editionNumber)

    activityEventService.recordPrimarySaleEvent(event, EVENT_TYPES.BID_PLACED, editionEntity, null, event.params._amount, event.params._bidder)
}

export function handleBidRejected(event: BidRejected): void {
    /*
      event BidRejected(
        address indexed _caller,
        address indexed _bidder,
        uint256 indexed _editionNumber,
        uint256 _amount
      );
    */
    let contract = getKnownOriginV2ForAddress(event.address)
    let editionEntity = editionService.loadOrCreateV2Edition(event.params._editionNumber, event.block, contract)

    let auctionEvent = auctionEventFactory.createBidRejected(event.block, event.transaction, editionEntity, event.params._bidder, event.params._amount);
    auctionEvent.save()

    let biddingHistory = editionEntity.biddingHistory
    biddingHistory.push(auctionEvent.id.toString())
    editionEntity.biddingHistory = biddingHistory
    editionEntity.save()

    dayService.recordDayBidRejectedCount(event)

    dayService.recordDayTotalValueCycledInBids(event, event.params._amount)

    auctionEventService.removeActiveBidOnEdition(event.params._editionNumber)
    offerService.clearEditionOffer(event.block, event.params._editionNumber)

    activityEventService.recordPrimarySaleEvent(event, EVENT_TYPES.BID_REJECTED, editionEntity, null, event.params._amount, event.params._bidder)
}

export function handleBidWithdrawn(event: BidWithdrawn): void {
    /*
      event BidWithdrawn(
        address indexed _bidder,
        uint256 indexed _editionNumber
      );
    */
    let contract = getKnownOriginV2ForAddress(event.address)
    let editionEntity = editionService.loadOrCreateV2Edition(event.params._editionNumber, event.block, contract)

    let auctionEvent = auctionEventFactory.createBidWithdrawn(event.block, event.transaction, editionEntity, event.params._bidder);
    auctionEvent.save()

    let biddingHistory = editionEntity.biddingHistory
    biddingHistory.push(auctionEvent.id.toString())
    editionEntity.biddingHistory = biddingHistory
    editionEntity.save()

    dayService.recordDayBidWithdrawnCount(event)

    auctionEventService.removeActiveBidOnEdition(event.params._editionNumber)
    offerService.clearEditionOffer(event.block, event.params._editionNumber)

    activityEventService.recordPrimarySaleEvent(event, EVENT_TYPES.BID_WITHDRAWN, editionEntity, null, null, event.params._bidder)
}

export function handleBidIncreased(event: BidIncreased): void {
    /*
      event BidIncreased(
        address indexed _bidder,
        uint256 indexed _editionNumber,
        uint256 _amount
      );
    */
    let contract = getKnownOriginV2ForAddress(event.address)
    let editionEntity = editionService.loadOrCreateV2Edition(event.params._editionNumber, event.block, contract)

    let auctionEvent = auctionEventFactory.createBidIncreased(event.block, event.transaction, editionEntity, event.params._bidder, event.params._amount);
    auctionEvent.save()

    let biddingHistory = editionEntity.biddingHistory
    biddingHistory.push(auctionEvent.id.toString())
    editionEntity.biddingHistory = biddingHistory
    editionEntity.save()

    dayService.recordDayBidIncreasedCount(event)
    dayService.recordDayTotalValueCycledInBids(event, event.params._amount)
    dayService.recordDayTotalValuePlaceInBids(event, event.params._amount)

    auctionEventService.recordActiveEditionBid(event.params._editionNumber, auctionEvent)
    offerService.recordEditionOffer(event.block, event.transaction, event.params._bidder, event.params._amount, null, event.params._editionNumber)

    activityEventService.recordPrimarySaleEvent(event, EVENT_TYPES.BID_INCREASED, editionEntity, null, event.params._amount, event.params._bidder)
}

export function handleBidderRefunded(event: BidderRefunded): void {
    // We know if monies are being sent back then there cannot be an open bid on the edition
    // TODO disabled for now, this event is sent on almost all others so dont want to double process in some form
    // auctionEventFactory.removeActiveBidOnEdition(event.params._editionNumber)
}
