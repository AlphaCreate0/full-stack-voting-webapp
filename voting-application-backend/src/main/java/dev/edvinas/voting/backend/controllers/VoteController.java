package dev.edvinas.voting.backend.controllers;

import dev.edvinas.voting.backend.models.Candidate;
import dev.edvinas.voting.backend.models.Vote;
import dev.edvinas.voting.backend.services.VoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping("/votes")
    public ResponseEntity<Vote> createVote(@RequestBody List<Integer> candidateIds) {
        Vote vote = voteService.createVote(candidateIds);
        return ResponseEntity.ok(vote);
    }

    @GetMapping("/votes")
    public List<Candidate> getAllVotes() {
        return voteService.getCandidatesSortedByVoteCount();
    }

//    @GetMapping("/votes/by-candidate")
//    public Iterable<Vote> getVotesByCandidate() {
//        return voteService.getVotesByCandidate();
//    }
//
//    @GetMapping("/votes/by-region")
//    public Iterable<Vote> getVotesByRegion() {
//        return voteService.getVotesByRegion();
//    }

}