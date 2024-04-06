import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const CLIENTID = import.meta.env.VITE_APP_CLIENT_ID;
const EventDetail = () => {
    
    let params = useParams();
    
    const [fullDetails, setFullDetails] = useState(null);

    useEffect(() => {
        
        const getEventDetail = async () => {
          const details = await fetch(`https://api.seatgeek.com/2/events?id=${params.id}&client_id=${CLIENTID}`);
          const json = await details.json();
          console.log(json);
          setFullDetails(json.events[0]);
        };
        
        getEventDetail().catch(console.error);
        
        
      }, [params.id]);
      
      console.log(fullDetails);

    return(
        <>
        {fullDetails && (
            <>
            <h1>{fullDetails.title}</h1>
                <img
                className="images"
                src={
                    fullDetails.performers.image}
                />
            <table>
            <tbody> 
                <tr>
                <th>Event Date </th>
                <td> {fullDetails.datetime_local}</td>
                </tr>
                <tr>
                <th>Website </th>
                <td>{<a href={fullDetails.url} target="_blank" rel="noopener noreferrer">{fullDetails.url}</a>} </td>
                </tr>
                <tr>
                <th>Event Type </th>
                <td>{fullDetails.type} </td>
                </tr>
                <tr>
                <th>Ticket Listing Count </th>
                <td> {fullDetails.stats.listing_count}</td>
                </tr>
                <tr>
                <th>Most Expensive Ticket </th>
                <td> {fullDetails.stats.highest_price != null ? "$" + fullDetails.stats.highest_price : 'N/A'}</td>
                </tr>
                <tr>
                <th>Cheapest Ticket Price </th>
                <td> {fullDetails.stats.lowest_price != null ? "$" + fullDetails.stats.lowest_price : 'N/A'}</td>
                </tr>
                <tr>
                <th>Average Ticket Price</th>
                <td> {fullDetails.stats.average_price != null ? "$" + fullDetails.stats.average_price : 'N/A'}</td>
                </tr>
                <tr>
                <th>Venue Name </th>
                <td> {fullDetails.venue.name}</td>
                </tr>
                <tr>
                <th>Venue Address </th>
                <td> {fullDetails.venue.address + ", " + fullDetails.venue.extended_address}</td>
                </tr>
                <tr>
                <th>Venue URL </th>
                <td> {fullDetails.venue.url}</td>
                </tr>
            </tbody>
            </table>
            </>)}
        </>
    )
}

export default EventDetail;