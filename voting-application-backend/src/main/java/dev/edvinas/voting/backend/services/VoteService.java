package dev.edvinas.voting.backend.services;

import dev.edvinas.voting.backend.exception.ResourceNotFoundException;
import dev.edvinas.voting.backend.models.Candidate;
import dev.edvinas.voting.backend.models.Vote;
import dev.edvinas.voting.backend.repositories.CandidateRepository;
import dev.edvinas.voting.backend.repositories.VoteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VoteService {

    private final VoteRepository voteRepository;
    private final CandidateRepository candidateRepository;

    public VoteService(VoteRepository voteRepository, CandidateRepository candidateRepository) {
        this.voteRepository = voteRepository;
        this.candidateRepository = candidateRepository;
    }

    public Iterable<Vote> getAllVotes() {
        return voteRepository.findAll();
    }

    public List<Candidate> getCandidatesSortedByVoteCount() {
        return candidateRepository.findAllByOrderByVoteCountDesc();
    }

    public Vote createVote(List<Integer> candidateIds) {
        List<Candidate> candidates = candidateRepository.findAllById(candidateIds);
        for (Candidate candidate : candidates) {
            candidate.setVoteCount(candidate.getVoteCount() + 1);
        }
        candidateRepository.saveAll(candidates);

        Vote vote = new Vote();
        vote.setCandidates(candidates);
        vote.setVoteTimestamp(LocalDateTime.now());
        vote.setVoteCount(1);

        return voteRepository.save(vote);
    }

    public Vote getVoteById(Integer voteId) {
        return voteRepository.findById(voteId)
                .orElseThrow(() -> new ResourceNotFoundException("Vote not found with id: " + voteId));
    }

}