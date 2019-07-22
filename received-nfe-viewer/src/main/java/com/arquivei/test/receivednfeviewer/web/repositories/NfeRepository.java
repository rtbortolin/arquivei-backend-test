package com.arquivei.test.receivednfeviewer.web.repositories;

import com.arquivei.test.receivednfeviewer.web.model.NfeData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NfeRepository extends JpaRepository<NfeData, String> {
}
