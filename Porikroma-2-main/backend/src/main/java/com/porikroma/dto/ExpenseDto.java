package com.porikroma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDto {
    private Long expenseId;
    private Long tripId;
    private String tripName;
    private Long paidByUserId;
    private String paidByUserName;
    private String expenseCategory;  // ACCOMMODATION, TRANSPORT, FOOD, ACTIVITIES, SHOPPING, EMERGENCY, OTHER
    private String description;
    private BigDecimal amount;
    private String currency;
    private LocalDate expenseDate;
    private String receiptUrl;
    private boolean isShared;
    private String splitMethod;  // EQUAL, PERCENTAGE, AMOUNT, CUSTOM
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Settlement information
    private List<ExpenseSettlementDto> settlements;
    private BigDecimal totalOwed;
    private BigDecimal totalPaid;
    private boolean isSettled;
}