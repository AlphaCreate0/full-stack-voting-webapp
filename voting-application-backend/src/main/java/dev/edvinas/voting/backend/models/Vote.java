package dev.edvinas.voting.backend.models;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vote")
public class Vote implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer voteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voter_id")
    private User user;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "vote_candidate",
            joinColumns = @JoinColumn(name = "vote_id"),
            inverseJoinColumns = @JoinColumn(name = "candidate_id")
    )
    private List<Candidate> candidate;

    @Column(name = "timestamp")
    private LocalDateTime voteTimestamp;

    @Column
    private String region;

    private int voteCount;

    public Integer getVoteId() {
        return voteId;
    }

    public void setVoteId(Integer voteId) {
        this.voteId = voteId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Candidate> getCandidates() {
        return candidate;
    }

    public void setCandidates(List<Candidate> candidates) {
        this.candidate = candidates;
    }

    public LocalDateTime getVoteTimestamp() {
        return voteTimestamp;
    }

    public void setVoteTimestamp(LocalDateTime voteTimestamp) {
        this.voteTimestamp = voteTimestamp;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public int getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(int voteCount) {
        this.voteCount = voteCount;
    }

    @Override
    public String toString() {
        return "Vote{" +
                "voteId=" + voteId +
                ", user=" + user +
                ", candidates=" + candidate +
                ", voteTimestamp=" + voteTimestamp +
                ", region='" + region + '\'' +
                ", voteCount=" + voteCount +
                '}';
    }
}