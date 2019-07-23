package com.arquivei.test.receivednfeviewer.web.repositories;

import com.arquivei.test.receivednfeviewer.web.model.NfeData;
import com.arquivei.test.receivednfeviewer.web.repositories.NfeRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@DataJpaTest
public class NfeRepositoryIntegrationTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private NfeRepository nfeRepository;


    @Test
    public void whenGetOne_thenReturnNfe() {
        NfeData data = new NfeData();
        data.setXml("<xml>");
        data.setTotalValue(150.90F);
        data.setAccessKey("123");

        entityManager.persist(data);
        entityManager.flush();

        NfeData retrievedData = nfeRepository.getOne("123");

        assertThat(retrievedData.getAccessKey()).isEqualTo(data.getAccessKey());
        assertThat(retrievedData.getXml()).isEqualTo(data.getXml());
        assertThat(retrievedData.getTotalValue()).isEqualTo(data.getTotalValue());
    }

    @Test
    public void whenExistsById_withWrongId_thenReturnFalse() {
        NfeData data = new NfeData();
        data.setXml("<xml>");
        data.setTotalValue(150.90F);
        data.setAccessKey("123");

        entityManager.persist(data);
        entityManager.flush();

        boolean exists = nfeRepository.existsById("1234");

        assertThat(exists).isFalse();
    }

    @Test
    public void whenExistsById_withValidId_thenReturnTrue() {
        NfeData data = new NfeData();
        data.setXml("<xml>");
        data.setTotalValue(150.90F);
        data.setAccessKey("123");

        entityManager.persist(data);
        entityManager.flush();

        boolean exists = nfeRepository.existsById("123");

        assertThat(exists).isTrue();
    }
}
