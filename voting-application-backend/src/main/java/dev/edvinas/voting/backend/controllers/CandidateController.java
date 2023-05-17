package dev.edvinas.voting.backend.controllers;

import dev.edvinas.voting.backend.models.Candidate;
import dev.edvinas.voting.backend.services.CandidateService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping("/candidates")
    public Iterable<Candidate> getAllCandidates() {
        return candidateService.getAllCandidates();
    }

    @GetMapping("/candidates/{id}")
    public Candidate getCandidate(@PathVariable Integer id) {
        return candidateService.getCandidateById(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/candidates")
    public Candidate createCandidate(@RequestBody Candidate candidate) {
        return candidateService.createCandidate(candidate);
    }


    @PutMapping("/candidates/{id}")
    public Candidate updateCandidate(@RequestBody Candidate candidateToUpdate, @PathVariable Integer id) {
        return candidateService.updateCandidate(id, candidateToUpdate);
    }

    @DeleteMapping("/candidates/{id}")
    public void deleteCandidate(@PathVariable Integer id) {
        candidateService.deleteCandidate(id);
    }


}
