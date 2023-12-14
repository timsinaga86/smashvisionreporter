require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default:fetch}) => fetch(...args));
const startggURL = "https://api.start.gg/gql/alpha";
const startggKey = process.env.STARTGG_KEY;

const getEventId = (tournamentName, eventName) => {
    const eventSlug = `tournament/${tournamentName}/event/${eventName}`;
    let eventId;
    fetch(startggURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json',
            Authorization: 'Bearer ' + startggKey
        },
        body: JSON.stringify({
            query: "query EventQuery($slug:String) {event(slug: $slug) {id name}}",
            variables: {
                slug: eventSlug
            },
        })
        }).then(r => r.json())
        .then(data => {
            console.log(data.data);
            eventId = data.data.event.id;
    })
    return eventId;
}

const getCompletedMatches = (eventId) => {
    fetch(startggURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json',
            Authorization: 'Bearer ' + startggKey
        },
        body: JSON.stringify({
            query: "query EventSets($eventId: ID!, $page: Int!, $perPage: Int!) { event(id: $eventId) {sets(page: $page perPage: $perPage sortType: STANDARD) {pageInfo {total} nodes {id slots {entrant {name}}}}}}",
            variables: {
                eventId: eventId,
                page: 1,
                perPage: 5
            },
        })
        }).then(r => r.json())
        .then(data => {
            console.log(data.data);
            console.log(data.data.event.sets.nodes[0]);
            console.log(data.data.event.sets.nodes[3].slots[1].entrant);
    })
}

getEventId('return-to-norris-64-the-pool-side-bracket', 'ultimate-singles');
getCompletedMatches(1030707);