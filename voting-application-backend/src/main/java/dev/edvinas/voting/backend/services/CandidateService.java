package dev.edvinas.voting.backend.services;

import dev.edvinas.voting.backend.exception.ResourceNotFoundException;
import dev.edvinas.voting.backend.models.Candidate;
import dev.edvinas.voting.backend.repositories.CandidateRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public class CandidateService {
    private final CandidateRepository candidateRepository;

    public CandidateService(CandidateRepository candidatesRepository) {
        this.candidateRepository = candidatesRepository;
    }

    public Candidate getCandidateById(Integer id) {
        Optional<Candidate> optionalCandidate = candidateRepository.findById(id);
        if (optionalCandidate.isPresent()) {
            return optionalCandidate.get();
        } else {
            throw new ResourceNotFoundException("Candidate not found with id: " + id);
        }
    }


    public List<Candidate> getAllCandidates () {
        return candidateRepository.findAll();
    }

    public Candidate createCandidate (Candidate candidate){
        candidateRepository.save(candidate);
        return candidate;
    }

    public Candidate updateCandidate(Integer id, Candidate candidateToUpdate) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + id));
        candidate.setFirstName(candidateToUpdate.getFirstName());
        candidate.setLastName(candidateToUpdate.getLastName());
        candidate.setDob(candidateToUpdate.getDob());
        candidate.setState(candidateToUpdate.getState());
        candidate.setDescription(candidateToUpdate.getDescription());
        return candidateRepository.save(candidate);
    }

    public void deleteCandidate(Integer id) {
        if (!candidateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Candidate not found with id: " + id);
        }
        candidateRepository.deleteById(id);
    }


}
