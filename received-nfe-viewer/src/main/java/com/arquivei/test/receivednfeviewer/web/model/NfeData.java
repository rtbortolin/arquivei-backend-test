package com.arquivei.test.receivednfeviewer.web.model;

import com.arquivei.test.receivednfeviewer.web.model.base.AuditModel;

import javax.persistence.*;

@Entity
@Table(name = "tb_nfe")
public class NfeData extends AuditModel {

    @Id
    private String accessKey;

    @Lob
    @Column
    private String xml;

    @Column
    private Float totalValue;

    public NfeData() {
    }

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public String getXml() {
        return xml;
    }

    public void setXml(String xml) {
        this.xml = xml;
    }

    public Float getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(Float totalValue) {
        this.totalValue = totalValue;
    }
}
