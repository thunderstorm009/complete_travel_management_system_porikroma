package com.porikroma.controller;

import com.porikroma.dto.ExpenseDto;
import com.porikroma.dto.ExpenseSettlementDto;
import com.porikroma.service.ExpenseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/users/me/expenses")
    public ResponseEntity<List<ExpenseDto>> getUserExpenses(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<ExpenseDto> expenses = expenseService.getUserExpenses(userId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/trips/{tripId}/expenses")
    public ResponseEntity<List<ExpenseDto>> getTripExpenses(@PathVariable Long tripId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        // Check if user is a member of this trip before allowing access to expenses
        if (!expenseService.isUserTripMember(tripId, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<ExpenseDto> expenses = expenseService.getTripExpenses(tripId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/expenses/{expenseId}")
    public ResponseEntity<ExpenseDto> getExpenseById(@PathVariable Long expenseId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        ExpenseDto expense = expenseService.getExpenseById(expenseId);
        if (expense == null) {
            return ResponseEntity.notFound().build();
        }
        // Check if user is a member of the trip this expense belongs to
        if (!expenseService.isUserTripMember(expense.getTripId(), userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(expense);
    }

    @PostMapping("/trips/{tripId}/expenses")
    public ResponseEntity<ExpenseDto> createTripExpense(
            @PathVariable Long tripId,
            @RequestBody ExpenseDto expenseDto,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        expenseDto.setTripId(tripId);
        expenseDto.setPaidByUserId(userId);
        ExpenseDto createdExpense = expenseService.createExpense(expenseDto);
        return ResponseEntity.ok(createdExpense);
    }

    @PostMapping("/expenses")
    public ResponseEntity<ExpenseDto> createExpense(
            @RequestBody ExpenseDto expenseDto,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        expenseDto.setPaidByUserId(userId);
        ExpenseDto createdExpense = expenseService.createExpense(expenseDto);
        return ResponseEntity.ok(createdExpense);
    }

    @PutMapping("/expenses/{expenseId}")
    public ResponseEntity<ExpenseDto> updateExpense(
            @PathVariable Long expenseId,
            @RequestBody ExpenseDto expenseDto,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        ExpenseDto updatedExpense = expenseService.updateExpense(expenseId, expenseDto, userId);
        return ResponseEntity.ok(updatedExpense);
    }

    @DeleteMapping("/expenses/{expenseId}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long expenseId,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        expenseService.deleteExpense(expenseId, userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/settlements/{settlementId}")
    public ResponseEntity<ExpenseSettlementDto> updateSettlement(
            @PathVariable Long settlementId,
            @RequestBody ExpenseSettlementDto settlementDto,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        // Only allow the user who owes or is owed money to update settlement
        if (!expenseService.canUserUpdateSettlement(settlementId, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        ExpenseSettlementDto updatedSettlement = expenseService.updateSettlement(settlementId, settlementDto);
        return ResponseEntity.ok(updatedSettlement);
    }

    @GetMapping("/trips/{tripId}/expenses/summary")
    public ResponseEntity<Object> getTripExpenseSummary(@PathVariable Long tripId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        // Check if user is a member of this trip before allowing access to expense summary
        if (!expenseService.isUserTripMember(tripId, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Object summary = expenseService.getTripExpenseSummary(tripId);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/expenses/{expenseId}/settle")
    public ResponseEntity<ExpenseSettlementDto> settleExpense(
            @PathVariable Long expenseId,
            @RequestBody ExpenseSettlementDto settlementData,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        ExpenseDto expense = expenseService.getExpenseById(expenseId);
        if (!expenseService.isUserTripMember(expense.getTripId(), userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        ExpenseSettlementDto settlement = expenseService.createSettlement(expenseId, settlementData, userId);
        return ResponseEntity.ok(settlement);
    }

    @GetMapping("/expenses/{expenseId}/settlements")
    public ResponseEntity<List<ExpenseSettlementDto>> getExpenseSettlements(
            @PathVariable Long expenseId,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        ExpenseDto expense = expenseService.getExpenseById(expenseId);
        if (!expenseService.isUserTripMember(expense.getTripId(), userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<ExpenseSettlementDto> settlements = expenseService.getExpenseSettlements(expenseId);
        return ResponseEntity.ok(settlements);
    }

    @PostMapping("/expense-settlements/{settlementId}/paid")
    public ResponseEntity<Void> markSettlementPaid(
            @PathVariable Long settlementId,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (!expenseService.canUserUpdateSettlement(settlementId, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        expenseService.markSettlementPaid(settlementId);
        return ResponseEntity.ok().build();
    }
}