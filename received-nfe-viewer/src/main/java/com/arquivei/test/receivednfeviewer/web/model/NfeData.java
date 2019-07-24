package com.arquivei.test.receivednfeviewer.web.model;

import com.arquivei.test.receivednfeviewer.web.model.base.AuditModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;

@Entity
@Table(name = "tb_nfe")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class NfeData extends AuditModel {

    @Id
    private String accessKey;

    @Column(nullable = false)
    private Float totalValue;

    @Column(columnDefinition = "varchar(max)")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String xml;

    public NfeData() {
    }

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public Float getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(Float totalValue) {
        this.totalValue = totalValue;
    }

    public String getXml() {
        return xml;
    }

    public void setXml(String xml) {
        this.xml = xml;
    }
}
