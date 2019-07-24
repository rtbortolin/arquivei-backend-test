package com.arquivei.test.receivednfeviewer.web.controllers;

import com.arquivei.test.receivednfeviewer.web.model.NfeData;
import com.arquivei.test.receivednfeviewer.web.repositories.NfeRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.result.JsonPathResultMatchers;

import static net.bytebuddy.matcher.ElementMatchers.is;
import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.matches;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@WebMvcTest(NfeController.class)
public class NfeControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private NfeRepository nfeRepository;

    @Test
    public void givenGetNfe_whenValidIdIsSent_thenReturnOK() throws Exception {
        NfeData nfe = new NfeData();
        nfe.setAccessKey("123");
        nfe.setXml("<xml>");
        nfe.setTotalValue(55.45F);

        given(nfeRepository.existsById(matches("123"))).willReturn(true);
        given(nfeRepository.getOne(matches("123"))).willReturn(nfe);

        mvc.perform(get("/api/nfe/123")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("status.code").value(200))
                .andExpect(jsonPath("status.message").value("OK"))
                .andExpect(jsonPath("data.accessKey").value(nfe.getAccessKey()))
                .andExpect(jsonPath("data.xml").doesNotHaveJsonPath())
                .andExpect(jsonPath("data.totalValue").value(nfe.getTotalValue()));
    }

    @Test
    public void givenGetNfe_whenInvalidIdIsSent_thenReturnNotFound() throws Exception {

        given(nfeRepository.existsById(matches("123"))).willReturn(false);

        mvc.perform(get("/api/nfe/123")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("status.code").value(404))
                .andExpect(jsonPath("status.message").value("Not Found"))
                .andExpect(jsonPath("data").doesNotHaveJsonPath());
    }

    @Test
    public void givenPostNfe_whenAccessKeyIsNotSent_thenReturnBadRequest() throws Exception {

        mvc.perform(post("/api/nfe")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"xml\": \"<xml></xml>\", \"totalValue\": 14.4}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status.code").value(400))
                .andExpect(jsonPath("status.message").value("Missing mandatory field 'accessKey'"));
    }

    @Test
    public void givenPostNfe_whenTotalValueIsNotSent_thenReturnBadRequest() throws Exception {

        mvc.perform(post("/api/nfe")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"accessKey\": \"123\", \"xml\": \"<xml></xml>\" }"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("status.code").value(400))
                .andExpect(jsonPath("status.message").value("Missing mandatory field 'totalValue'"));
    }

    @Test
    public void givenPostNfe_whenXmlIsNotSent_thenReturnCreated() throws Exception {
        NfeData nfe = new NfeData();
        nfe.setAccessKey("123");
        nfe.setXml("<xml>");
        nfe.setTotalValue(55.45F);

        given(nfeRepository.save(any())).willReturn(nfe);

        mvc.perform(post("/api/nfe")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"accessKey\": \"123\", \"totalValue\": 14.4}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("status.code").value(201))
                .andExpect(jsonPath("status.message").value("Created"))
                .andExpect(header().string("Location", "http://localhost/api/nfe/123"));
    }

}