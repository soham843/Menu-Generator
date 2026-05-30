import pandas as pd

def consolidate_revenue(excel_file_path, output_file_path=r'C:\Users\soham\OneDrive\Desktop\VS code testing\numbers sheet analysis.xlsx'):
    """
    Consolidates revenue from multiple monthly sheets in an Excel workbook.
    
    Args:
        excel_file_path (str): Path to the Excel workbook file.
        output_file_path (str): Path to save the consolidated summary (default: 'consolidated_summary.xlsx').
    
    Assumptions:
        - Each sheet represents a month.
        - Each sheet has columns: 'Enterprise' (account names) and 'Actual Revenue' (revenue values).
        - Account names are unique identifiers.
    """
    try:
        # Load the Excel file
        xls = pd.ExcelFile(excel_file_path)
        
        # Dictionary to hold total revenue for each account
        account_totals = {}
        
        # Process each sheet
        for sheet_name in xls.sheet_names:
            print(f"Processing sheet: {sheet_name}")
            df = pd.read_excel(xls, sheet_name)
            
            # Check if required columns exist
            if 'Enterprise' not in df.columns or 'Actual Revenue' not in df.columns:
                print(f"Warning: Sheet '{sheet_name}' is missing required columns. Skipping.")
                continue
            
            # Sum revenue for each account in this sheet
            for _, row in df.iterrows():
                account = row['Enterprise']
                revenue = row['Actual Revenue']
                
                # Handle potential NaN values
                if pd.isna(revenue):
                    revenue = 0
                
                if account in account_totals:
                    account_totals[account] += revenue
                else:
                    account_totals[account] = revenue
        
        # Create summary DataFrame
        summary_df = pd.DataFrame(
            list(account_totals.items()), 
            columns=['Account', 'Total Revenue']
        )
        
        # Sort by account name for better readability
        summary_df = summary_df.sort_values('Account')
        
        # Save to Excel
        summary_df.to_excel(output_file_path, index=False)
        print(f"Consolidated summary saved to: {output_file_path}")
        
        # Display summary
        print("\nConsolidated Revenue Summary:")
        print(summary_df.to_string(index=False))
        
    except FileNotFoundError:
        print(f"Error: File '{excel_file_path}' not found.")
    except Exception as e:
        print(f"Error processing file: {str(e)}")

# Example usage
if __name__ == "__main__":
    # Replace 'your_workbook.xlsx' with the actual path to your Excel file
    consolidate_revenue(r'C:\Users\soham\OneDrive\Desktop\VS code testing\numbers sheet analysis\Numbers - Presolv360 FY 25-26.xlsx')