package dev.edvinas.voting.backend.models;

public enum Region {
    NEW_ENGLAND("New England"),
    MID_ATLANTIC("Mid-Atlantic"),
    THE_SOUTH("The South"),
    THE_SOUTHWEST("The Southwest"),
    THE_WEST("The West");

    private String label;

    Region(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}