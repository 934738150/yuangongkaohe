using SqlServerDataAdapter;
using StaffAssessment.Infrastructure.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace StaffAssessment.Service.StaffAssessment
{
    public class StaffAssessmentRankingService
    {
//        public static DataTable GetAssessmentResultTableByDay(string mProductionID, string mWorkingSectionID, string mStaffId, string mGroupId, string mStartTime, string mEndTime, string mVersionId, string mStatisticalCycle)
//        {
//            string connectionString = ConnectionStringFactory.NXJCConnectionString;
//            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
//            string mySql = @"SELECT [KeyId]
//                                    ,[Name]
//                                    ,[Type]
//                                    ,[OrganizationID]
//                                    ,[WorkingSectionID]
//                                FROM [NXJC_DEV].[dbo].[tz_Assessment]
//                                where [OrganizationID]=@mOrganizationID
//                                and [WorkingSectionID]=@mWorkingSectionID";
//            SqlParameter[] para = { new SqlParameter("@mOrganizationID", mProductionID) ,
//                                  new SqlParameter("@mWorkingSectionID", mWorkingSectionID) 
//                                  };
//            DataTable dt = factory.Query(mySql, para);
//            return dt;
//        }
        public static DataTable GetAssessmentResultTable(string mProductionID, string mWorkingSectionID, string mGroupId, string mStartTime, string mEndTime,  string mStatisticalCycle)
        {
            DataTable resultTable = generationTableTemplate(mProductionID, mWorkingSectionID, mGroupId, mStartTime, mEndTime, mStatisticalCycle);
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            DataTable table = new DataTable();
            if (mStatisticalCycle.Equals("month") || mStatisticalCycle.Equals("day"))
            {
                string mySql = @" select C.Name,convert(char(10),A.StartTime,120) as [Time],B.[AssessmenScore] from [dbo].[tz_ShiftAssessmentResult] A,(select KeyId,sum([AssessmenScore]) as [AssessmenScore] from [dbo].[assessment_ShiftAssessmentResultDetail]
                              where KeyId in( select KeyId from [dbo].[tz_ShiftAssessmentResult]
                              where [OrganizationID]=@mProductionID
                              and [WorkingSectionID]=@mWorkingSectionID
                              and [GroupId]=@mGroupId
                              and [StartTime]>=convert(datetime,@mStartTime)
                              and [StartTime]<=convert(datetime,@mEndTime)
                              )
                              group by KeyId,[AssessmenScore]) B,[dbo].[system_StaffInfo] C
                              where A.KeyId=B.KeyId
                              and A.StaffID=C.StaffInfoID
                              order by Name,Time";
                SqlParameter[] para = { new SqlParameter("@mProductionID", mProductionID) ,
                                        new SqlParameter("@mWorkingSectionID", mWorkingSectionID),
                                        new SqlParameter("@mGroupId", mGroupId),
                                        new SqlParameter("@mStartTime", mStartTime),
                                        new SqlParameter("@mEndTime", mEndTime)
                                     };
                 table = factory.Query(mySql, para);           
            }
            int rowNum = 0;
            if (table.Rows.Count > 0)
            {
                resultTable.Rows.Add(table.Rows[0]["Name"].ToString().Trim());
                resultTable.Rows[rowNum][table.Rows[0]["Time"].ToString().Trim()] = table.Rows[0]["AssessmenScore"];
                decimal averageValue = Convert.ToDecimal(table.Rows[0]["AssessmenScore"]);
                resultTable.Rows[rowNum]["总分"] = averageValue;
                for (int i = 0; i < table.Rows.Count - 1; i++)
                {
                    if (table.Rows[i + 1]["Name"].ToString().Trim().Equals(table.Rows[i]["Name"].ToString().Trim()))
                    {
                        resultTable.Rows[rowNum][table.Rows[i + 1]["Time"].ToString().Trim()] = table.Rows[i + 1]["AssessmenScore"];
                        averageValue = averageValue + Convert.ToDecimal(table.Rows[i + 1]["AssessmenScore"]);
                        resultTable.Rows[rowNum]["总分"] = averageValue;

                    }
                    else
                    {
                        ++rowNum;
                        resultTable.Rows.Add(table.Rows[i + 1]["Name"].ToString().Trim());
                        resultTable.Rows[rowNum][table.Rows[i + 1]["Time"].ToString().Trim()] = table.Rows[i + 1]["AssessmenScore"];
                        averageValue = Convert.ToDecimal(table.Rows[i + 1]["AssessmenScore"]);
                        resultTable.Rows[rowNum]["总分"] = averageValue;
                    }
                }
                DataView dv = resultTable.DefaultView;
                dv.Sort = "总分 desc";
                resultTable = dv.ToTable();
                for (int i = 0; i < resultTable.Rows.Count; i++)
                {
                    resultTable.Rows[i]["排名"] = i + 1;
                }
            }
          
            return resultTable;
        }
        public static string GetGenerationTableTemplateColumnsJson(string mProductionID, string mWorkingSectionID, string mGroupId, string mStartTime, string mEndTime, string mStatisticalCycle)
        {
            DataTable resultTable = generationTableTemplate(mProductionID, mWorkingSectionID, mGroupId, mStartTime, mEndTime, mStatisticalCycle);
            string json = "{\"columns\":[";
            for(int i=0;i<resultTable.Columns.Count;i++)
            {               
                string columnName = resultTable.Columns[i].ColumnName;
                int columnLength = 0;
                if (Regex.IsMatch(columnName, @"^[\u4e00-\u9fa5]+$"))
                {
                    columnLength = columnName.Length * 20;
                }
                else {
                    columnLength = columnName.Length * 10;             
                }


                json =json + "{\"field\":\"" + columnName + "\",\"title\":\"" + columnName + "\",\"width\":" + columnLength + ",\"align\":\"center\"},";
  //{ field: 'WorkingSectionName', title: '岗位名称', width: 80 },
            }
            json=json.Remove(json.Length-1)+"]}";
            return json;
        }
        private static DataTable generationTableTemplate(string mProductionID, string mWorkingSectionID, string mGroupId, string mStartTime, string mEndTime, string mStatisticalCycle)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            DataTable table = new DataTable();
            if (mStatisticalCycle.Equals("month"))
            {
                string mySql = @" select convert(char(10),A.[StartTime],120) as [StartTime] from (select distinct([StartTime]) from [dbo].[tz_ShiftAssessmentResult]
                              where [OrganizationID]=@mProductionID
                              and [WorkingSectionID]=@mWorkingSectionID
                              and [GroupId]=@mGroupId
                              and [StartTime]>=convert(datetime,@mStartTime)
                              and [StartTime]<=convert(datetime,@mEndTime)
							  group by [StartTime])A
							  order by convert(char(10),[StartTime],120)";
                SqlParameter[] para = { new SqlParameter("@mProductionID", mProductionID) ,
                                        new SqlParameter("@mWorkingSectionID", mWorkingSectionID),
                                        new SqlParameter("@mGroupId", mGroupId),
                                        new SqlParameter("@mStartTime", mStartTime),
                                        new SqlParameter("@mEndTime", mEndTime)
                                     };
                table = factory.Query(mySql, para);
            }
            DataTable tableTemplate = new DataTable();
            tableTemplate.Columns.Add("员工姓名", typeof(string));
            for (int i = 0; i < table.Rows.Count;i++ ) {
                tableTemplate.Columns.Add(table.Rows[i]["StartTime"].ToString().Trim(), typeof(string));
            }
            tableTemplate.Columns.Add("总分", typeof(string));
            tableTemplate.Columns.Add("排名", typeof(string));
            return tableTemplate;
        }
    }
}
