package com.arquivei.test.receivednfeviewer.web.model.rest;

import com.fasterxml.jackson.annotation.JsonInclude;

public class RestResponse {

    private Status status;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Object data;

    public RestResponse(Status status){
        this(status, null);
    }

    public RestResponse(Status status, Object data) {
        this.status = status;
        this.data = data;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
