package com.porikroma.repository;

import com.porikroma.dto.ExpenseDto;
import com.porikroma.dto.ExpenseSettlementDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class ExpenseRepositoryImpl implements ExpenseRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<ExpenseDto> expenseRowMapper = new RowMapper<ExpenseDto>() {
        @Override
        public ExpenseDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            ExpenseDto expense = new ExpenseDto();
            expense.setExpenseId(rs.getLong("expense_id"));
            expense.setTripId(rs.getLong("trip_id"));
            expense.setPaidByUserId(rs.getLong("paid_by_user_id"));
            expense.setExpenseCategory(rs.getString("expense_category"));
            expense.setDescription(rs.getString("description"));
            expense.setAmount(rs.getBigDecimal("amount"));
            expense.setCurrency(rs.getString("currency"));
            expense.setExpenseDate(rs.getDate("expense_date").toLocalDate());
            if (rs.getString("receipt_url") != null) {
                expense.setReceiptUrl(rs.getString("receipt_url"));
            }
            expense.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            expense.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            return expense;
        }
    };

    private final RowMapper<ExpenseSettlementDto> settlementRowMapper = new RowMapper<ExpenseSettlementDto>() {
        @Override
        public ExpenseSettlementDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            ExpenseSettlementDto settlement = new ExpenseSettlementDto();
            settlement.setSettlementId(rs.getLong("settlement_id"));
            settlement.setExpenseId(rs.getLong("expense_id"));
            settlement.setUserId(rs.getLong("user_id"));
            settlement.setAmountOwed(rs.getBigDecimal("amount_owed"));
            settlement.setAmountPaid(rs.getBigDecimal("amount_paid"));
            settlement.setChecked(rs.getBoolean("is_checked"));
            settlement.setNotes(rs.getString("notes"));
            settlement.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            settlement.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            return settlement;
        }
    };

    @Override
    public List<ExpenseDto> findByUserId(Long userId) {
        String sql = """
            SELECT DISTINCT e.* FROM trip_expenses e 
            LEFT JOIN expense_settlements es ON e.expense_id = es.expense_id 
            WHERE e.paid_by_user_id = ? OR es.user_id = ?
            ORDER BY e.expense_date DESC
            """;
        return jdbcTemplate.query(sql, expenseRowMapper, userId, userId);
    }

    @Override
    public List<ExpenseDto> findByTripId(Long tripId) {
        String sql = "SELECT * FROM trip_expenses WHERE trip_id = ? ORDER BY expense_date DESC";
        return jdbcTemplate.query(sql, expenseRowMapper, tripId);
    }

    @Override
    public Optional<ExpenseDto> findById(Long expenseId) {
        String sql = "SELECT * FROM trip_expenses WHERE expense_id = ?";
        List<ExpenseDto> expenses = jdbcTemplate.query(sql, expenseRowMapper, expenseId);
        return expenses.isEmpty() ? Optional.empty() : Optional.of(expenses.get(0));
    }

    @Override
    public ExpenseDto save(ExpenseDto expenseDto) {
        String sql = """
            INSERT INTO trip_expenses (trip_id, paid_by_user_id, expense_category, description, 
            amount, currency, expense_date, receipt_url, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, expenseDto.getTripId());
            ps.setLong(2, expenseDto.getPaidByUserId());
            ps.setString(3, expenseDto.getExpenseCategory());
            ps.setString(4, expenseDto.getDescription());
            ps.setBigDecimal(5, expenseDto.getAmount());
            ps.setString(6, expenseDto.getCurrency());
            ps.setDate(7, java.sql.Date.valueOf(expenseDto.getExpenseDate()));
            ps.setString(8, expenseDto.getReceiptUrl());
            ps.setTimestamp(9, java.sql.Timestamp.valueOf(expenseDto.getCreatedAt()));
            ps.setTimestamp(10, java.sql.Timestamp.valueOf(expenseDto.getUpdatedAt()));
            return ps;
        }, keyHolder);

        expenseDto.setExpenseId(keyHolder.getKey().longValue());
        return expenseDto;
    }

    @Override
    public ExpenseDto update(ExpenseDto expenseDto) {
        String sql = """
            UPDATE expenses SET trip_id = ?, paid_by_user_id = ?, expense_category = ?, 
            description = ?, amount = ?, currency = ?, expense_date = ?, receipt_url = ?, 
            updated_at = ? WHERE expense_id = ?
            """;
        
        jdbcTemplate.update(sql,
            expenseDto.getTripId(),
            expenseDto.getPaidByUserId(),
            expenseDto.getExpenseCategory(),
            expenseDto.getDescription(),
            expenseDto.getAmount(),
            expenseDto.getCurrency(),
            java.sql.Date.valueOf(expenseDto.getExpenseDate()),
            expenseDto.getReceiptUrl(),
            java.sql.Timestamp.valueOf(expenseDto.getUpdatedAt()),
            expenseDto.getExpenseId());
        
        return expenseDto;
    }

    @Override
    public void deleteById(Long expenseId) {
        // First delete settlements
        String deleteSettlementsSql = "DELETE FROM expense_settlements WHERE expense_id = ?";
        jdbcTemplate.update(deleteSettlementsSql, expenseId);
        
        // Then delete expense
        String deleteExpenseSql = "DELETE FROM trip_expenses WHERE expense_id = ?";
        jdbcTemplate.update(deleteExpenseSql, expenseId);
    }

    @Override
    public List<ExpenseSettlementDto> findSettlementsByExpenseId(Long expenseId) {
        String sql = "SELECT * FROM expense_settlements WHERE expense_id = ?";
        return jdbcTemplate.query(sql, settlementRowMapper, expenseId);
    }

    @Override
    public ExpenseSettlementDto updateSettlement(ExpenseSettlementDto settlementDto) {
        String sql = """
            UPDATE expense_settlements SET amount_owed = ?, amount_paid = ?, 
            is_checked = ?, notes = ?, updated_at = ? WHERE settlement_id = ?
            """;
        
        jdbcTemplate.update(sql,
            settlementDto.getAmountOwed(),
            settlementDto.getAmountPaid(),
            settlementDto.isChecked(),
            settlementDto.getNotes(),
            java.sql.Timestamp.valueOf(settlementDto.getUpdatedAt()),
            settlementDto.getSettlementId());
        
        return settlementDto;
    }

    @Override
    public void createSettlementsForExpense(Long expenseId, List<Long> memberIds, BigDecimal amountPerPerson) {
        String sql = """
            INSERT INTO expense_settlements (expense_id, user_id, amount_owed, amount_paid, 
            is_checked, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
            """;
        
        for (Long memberId : memberIds) {
            jdbcTemplate.update(sql,
                expenseId,
                memberId,
                amountPerPerson,
                BigDecimal.ZERO,
                false,
                java.sql.Timestamp.valueOf(java.time.LocalDateTime.now()),
                java.sql.Timestamp.valueOf(java.time.LocalDateTime.now()));
        }
    }

    @Override
    public Object getTripExpenseSummary(Long tripId) {
        Map<String, Object> summary = new HashMap<>();
        
        // Total expenses
        String totalSql = "SELECT COALESCE(SUM(amount), 0) FROM trip_expenses WHERE trip_id = ?";
        BigDecimal totalExpenses = jdbcTemplate.queryForObject(totalSql, BigDecimal.class, tripId);
        summary.put("totalExpenses", totalExpenses != null ? totalExpenses : BigDecimal.ZERO);
        
        // Total settlements
        String settlementsSql = """
            SELECT COALESCE(SUM(es.amount_paid), 0) FROM expense_settlements es 
            INNER JOIN trip_expenses e ON es.expense_id = e.expense_id 
            WHERE e.trip_id = ?
            """;
        BigDecimal totalPaid = jdbcTemplate.queryForObject(settlementsSql, BigDecimal.class, tripId);
        summary.put("totalPaid", totalPaid != null ? totalPaid : BigDecimal.ZERO);
        
        // Remaining balance
        BigDecimal totalExpensesValue = (BigDecimal) summary.get("totalExpenses");
        BigDecimal totalPaidValue = (BigDecimal) summary.get("totalPaid");
        summary.put("remainingBalance", totalExpensesValue.subtract(totalPaidValue));
        
        // Expense count
        String countSql = "SELECT COUNT(*) FROM trip_expenses WHERE trip_id = ?";
        Integer expenseCount = jdbcTemplate.queryForObject(countSql, Integer.class, tripId);
        summary.put("expenseCount", expenseCount != null ? expenseCount : 0);
        
        return summary;
    }

    @Override
    public Optional<ExpenseSettlementDto> findSettlementById(Long settlementId) {
        String sql = """
            SELECT es.settlement_id, es.expense_id, es.user_id, u.username, u.email,
                   es.amount_owed, es.amount_paid, es.is_checked, es.notes,
                   es.created_at, es.updated_at
            FROM expense_settlements es
            INNER JOIN users u ON es.user_id = u.user_id
            WHERE es.settlement_id = ?
            """;
        
        List<ExpenseSettlementDto> settlements = jdbcTemplate.query(sql, settlementRowMapper, settlementId);
        return settlements.isEmpty() ? Optional.empty() : Optional.of(settlements.get(0));
    }
}