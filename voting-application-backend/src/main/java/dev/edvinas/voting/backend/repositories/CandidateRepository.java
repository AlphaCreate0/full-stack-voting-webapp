package dev.edvinas.voting.backend.repositories;

import dev.edvinas.voting.backend.models.Candidate;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Integer> {

    boolean existsById(Integer id);

    List<Candidate> findAllByOrderByVoteCountDesc();
}

