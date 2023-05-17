package dev.edvinas.voting.backend.repositories;

import dev.edvinas.voting.backend.models.Candidate;
import dev.edvinas.voting.backend.models.User;
import dev.edvinas.voting.backend.models.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Integer> {

    List<Candidate> findAllByOrderByVoteCountDesc();

    @Query("SELECT v.region FROM Vote v GROUP BY v.region ORDER BY COUNT(v) DESC")
    List<String> findRegionsWithMostVotes();

    @Query("SELECT v.candidate, COUNT(v) as voteCount FROM Vote v GROUP BY v.candidate ORDER BY voteCount DESC")
    List<Object[]> findCandidatesWithMostVotes();

    List<Vote> findByRegion(String region);

}
