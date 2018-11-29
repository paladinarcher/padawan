package com.zetcode.res;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("msg")
public class MyMessage {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getMessage() {
        
        return "My message\n";
    }
}
