package com.porikroma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSettlementDto {
    private Long settlementId;
    private Long expenseId;
    private Long userId;
    private String userName;
    private String userEmail;
    private BigDecimal amountOwed;
    private BigDecimal amountPaid;
    private boolean isChecked;  // Checkbox for "paid/confirmed"
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}