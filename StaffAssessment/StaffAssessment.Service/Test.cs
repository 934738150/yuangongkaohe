using SqlServerDataAdapter;
using StaffAssessment.Infrastructure.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace StaffAssessment.Service
{
    public class Test
    {
        /// <summary>
        /// 获取表结构与表assessment_ShiftAssessmentResultDetail相同
        /// </summary>
        /// <param name="myWorkingTimeTable"></param>
        /// <param name="myAssessmentItemsTable"></param>
        /// <returns>  </returns>
        public static DataTable GetStaffAssessment(DataTable myWorkingTimeTable, DataTable myAssessmentItemsTable) 
        {
            string mKeyId=System.Guid.NewGuid().ToString();
            DataTable table = Tablestructure();
            int mcount=myWorkingTimeTable.Rows.Count;
            //写入第一行
            string mAssessmentId=myAssessmentItemsTable.Rows[0]["AssessmentId"].ToString().Trim();
            string mOrganizaitonID=myAssessmentItemsTable.Rows[0]["OrganizaitonID"].ToString().Trim();
            decimal mWeightedValue=Convert.ToDecimal(myAssessmentItemsTable.Rows[0]["WeightedValue"]);
            decimal mBestValue = Convert.ToDecimal(myAssessmentItemsTable.Rows[0]["BestValue"]);
            decimal mWorstValue = Convert.ToDecimal(myAssessmentItemsTable.Rows[0]["WorstValue"]);
            decimal AssessmenScore = (Convert.ToDecimal(myAssessmentItemsTable.Rows[0]["WeightedValue"])
                +Convert.ToDecimal(myAssessmentItemsTable.Rows[0]["BestValue"])
                +Convert.ToDecimal(myAssessmentItemsTable.Rows[0]["WorstValue"]));
            decimal WeightedAverageCredit = (Convert.ToDecimal(myAssessmentItemsTable.Rows[0]["WeightedValue"]) * mcount
                + Convert.ToDecimal(myAssessmentItemsTable.Rows[0]["BestValue"]) * mcount
                + Convert.ToDecimal(myAssessmentItemsTable.Rows[0]["WorstValue"]) * mcount);
           // table.Rows.Add(System.Guid.NewGuid().ToString(), mAssessmentId, "Energy", mOrganizaitonID, mKeyId, mWeightedValue, mBestValue, mWorstValue, AssessmenScore, WeightedAverageCredit);
            for (int i = 0;i< myAssessmentItemsTable.Rows.Count-1;i++ )
            {
                if (myAssessmentItemsTable.Rows[i + 1]["AssessmentId"].ToString().Trim().Equals(myAssessmentItemsTable.Rows[i]["AssessmentId"].ToString().Trim()))
                {
                    //下一个考核项与上一个考核项相同  值进行累计
                    // mOrganizaitonID = myAssessmentItemsTable.Rows[i+1]["OrganizaitonID"].ToString().Trim();
                    mWeightedValue = mWeightedValue + Convert.ToDecimal(myAssessmentItemsTable.Rows[i + 1]["WeightedValue"]);
                    mBestValue = mBestValue + Convert.ToDecimal(myAssessmentItemsTable.Rows[i + 1]["BestValue"]);
                    mWorstValue = mWorstValue + Convert.ToDecimal(myAssessmentItemsTable.Rows[i + 1]["WorstValue"]);
                    AssessmenScore = AssessmenScore + (Convert.ToDecimal(myAssessmentItemsTable.Rows[i + 1]["WeightedValue"])
                       + Convert.ToDecimal(myAssessmentItemsTable.Rows[i + 1]["BestValue"])
                       + Convert.ToDecimal(myAssessmentItemsTable.Rows[i + 1]["WorstValue"]));
                    WeightedAverageCredit = WeightedAverageCredit + (Convert.ToDecimal(myAssessmentItemsTable.Rows[i + 1]["WeightedValue"]) * mcount
                       + Convert.ToDecimal(myAssessmentItemsTable.Rows[i + 1]["BestValue"]) * mcount
                       + Convert.ToDecimal(myAssessmentItemsTable.Rows[i + 1]["WorstValue"]) * mcount);
                    //if(){
                    
                    
                    //}
               }
                else {
                    table.Rows.Add(System.Guid.NewGuid().ToString(), mAssessmentId, "Energy", mOrganizaitonID, mKeyId, mWeightedValue.ToString(), mBestValue.ToString(), mWorstValue.ToString(), AssessmenScore.ToString(), WeightedAverageCredit.ToString());

                    mAssessmentId = myAssessmentItemsTable.Rows[i+1]["AssessmentId"].ToString().Trim();
                    mOrganizaitonID = myAssessmentItemsTable.Rows[i+1]["OrganizaitonID"].ToString().Trim();

                    mWeightedValue=Convert.ToDecimal(myAssessmentItemsTable.Rows[i+1]["WeightedValue"]);
                    mBestValue = Convert.ToDecimal(myAssessmentItemsTable.Rows[i+1]["BestValue"]);
                    mWorstValue = Convert.ToDecimal(myAssessmentItemsTable.Rows[i+1]["WorstValue"]);
                    AssessmenScore = (Convert.ToDecimal(myAssessmentItemsTable.Rows[i+1]["WeightedValue"])
                           +Convert.ToDecimal(myAssessmentItemsTable.Rows[i+1]["BestValue"])
                           +Convert.ToDecimal(myAssessmentItemsTable.Rows[i+1]["WorstValue"]));
                    WeightedAverageCredit = (Convert.ToDecimal(myAssessmentItemsTable.Rows[i+1]["WeightedValue"]) * mcount
                        + Convert.ToDecimal(myAssessmentItemsTable.Rows[i+1]["BestValue"]) * mcount
                        + Convert.ToDecimal(myAssessmentItemsTable.Rows[i+1]["WorstValue"]) * mcount);            
                }
                if (myAssessmentItemsTable.Rows.Count - 2==i)
                {
                    table.Rows.Add(System.Guid.NewGuid().ToString(), mAssessmentId, "Energy", mOrganizaitonID, mKeyId, mWeightedValue.ToString(), mBestValue.ToString(), mWorstValue.ToString(), AssessmenScore.ToString(), WeightedAverageCredit.ToString());    
                }            
            }
            return table;       
        }
        private static DataTable Tablestructure() 
        {
                  // [Id]
                  //,[AssessmentId]
                  //,[ObjectId]
                  //,[OrganizaitonID]
                  //,[KeyId]
                  //,[WeightedValue]
                  //,[BestValue]
                  //,[WorstValue]
                  //,[AssessmenScore]
                  //,[WeightedAverageCredit]
            DataTable table = new DataTable();
            table.Columns.Add("Id",typeof(string));
            table.Columns.Add("AssessmentId", typeof(string));
            table.Columns.Add("ObjectId", typeof(string));
            table.Columns.Add("OrganizaitonID", typeof(string));
            table.Columns.Add("KeyId", typeof(string));
            table.Columns.Add("WeightedValue", typeof(string));
            table.Columns.Add("BestValue", typeof(string));
            table.Columns.Add("WorstValue", typeof(string));
            table.Columns.Add("AssessmenScore", typeof(string));
            table.Columns.Add("WeightedAverageCredit", typeof(string));
            return table;
        
        }
    }
}
