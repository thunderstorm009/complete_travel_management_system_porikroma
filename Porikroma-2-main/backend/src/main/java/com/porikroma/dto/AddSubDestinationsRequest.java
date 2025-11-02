package com.porikroma.dto;

import lombok.Data;
import java.util.List;

@Data
public class AddSubDestinationsRequest {
    private List<Long> subDestinationIds;
}