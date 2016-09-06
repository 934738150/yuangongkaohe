using SqlServerDataAdapter;
using StaffAssessment.Infrastructure.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace StaffAssessment.Service.StaffAssessment
{
    public class StaffAssessmentService
    {
        public static DataTable GetWorkingSectionByStaffSignIn(string mOrganizationID, string mStartTime, string mEndTime)
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT distinct( convert(int,A.[StaffID])) as id
                                 ,A.[StaffID]+' '+B.[Name] as [text]
                                 ,B.[Name] ,A.[Shifts]
                              FROM [dbo].[shift_staffSignInRecord] A,[dbo].[system_StaffInfo] B
                              where A.[StaffID]=B.[StaffInfoID]
                              and A.[OrganizationID] like @mOrganizationID+'%'
                              and convert(datetime,[vDate])>=convert(datetime,@mStartTime)
                              and convert(datetime,[vDate])<=convert(datetime,@mEndTime)
                            union
                            SELECT convert(int,0) as id, '全部' as [text],'' as [Name],'' as [Shifts]
                              order by convert(int,A.[StaffID]),[Shifts],[Name]";
            SqlParameter[] para = { 
                                      new SqlParameter("@mOrganizationID", mOrganizationID),
                                      new SqlParameter("@mStartTime", mStartTime),
                                      new SqlParameter("@mEndTime", mEndTime)
                                  };
            DataTable dt = factory.Query(mySql, para);
            return dt;
        }

        public static DataTable GetAssessmentVersionTable(string mOrganizationID, string mWorkingSectionID) 
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT [KeyId]
                                    ,[Name]
                                    ,[Type]
                                    ,[OrganizationID]
                                    ,[WorkingSectionID]
                                FROM [NXJC_DEV].[dbo].[tz_Assessment]
                                where [OrganizationID]=@mOrganizationID
                                and [WorkingSectionID]=@mWorkingSectionID";
            SqlParameter[] para = { new SqlParameter("@mOrganizationID", mOrganizationID) ,
                                  new SqlParameter("@mWorkingSectionID", mWorkingSectionID) 
                                  };
            DataTable dt = factory.Query(mySql, para);
            return dt;          
        }
        public static DataTable GetAssessmentResultTableByDay(string mProductionID, string mWorkingSectionID, string mStaffId, string mGroupId, string mStartTime, string mEndTime, string mVersionId, string mStatisticalCycle) 
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT [KeyId]
                                    ,[Name]
                                    ,[Type]
                                    ,[OrganizationID]
                                    ,[WorkingSectionID]
                                FROM [NXJC_DEV].[dbo].[tz_Assessment]
                                where [OrganizationID]=@mOrganizationID
                                and [WorkingSectionID]=@mWorkingSectionID";
            SqlParameter[] para = { new SqlParameter("@mOrganizationID", mProductionID) ,
                                  new SqlParameter("@mWorkingSectionID", mWorkingSectionID) 
                                  };
            DataTable dt = factory.Query(mySql, para);
            return dt;     
        
        }
        public static DataTable GetStaffAssessmentTZ(string mProductionID, string mWorkingSectionID, string mStaffId, string mStaffName, string mGroupName, string mGroupId, string mStartTime, string mVersionId, string mStatisticalCycle) 
        {
            DataTable tztable = tztableStructrue();
         //   DataTable table = tableStructure();
            string starTime = "";
            string endTime = "";
            if (mStatisticalCycle.Equals("month"))
            {
                DateTime time01 = Convert.ToDateTime(mStartTime + "-01");
                DateTime time02 = time01.AddMonths(1).AddMinutes(-1);
                starTime = time01.ToString("yyyy-MM-dd HH:mm:ss");
                endTime = time02.ToString("yyyy-MM-dd HH:mm:ss");
            }
            //全部员工
            if (mStaffId.Equals("0"))
            {
                DataTable staffList = commonClass.GetStaffInfoTable(mProductionID, mWorkingSectionID);
                if (mStatisticalCycle.Equals("month"))
                {
                    foreach (DataRow dr in staffList.Rows)
                    {
                        if (!dr["Name"].ToString().Trim().Equals(""))
                            tztable.Rows.Add(System.Guid.NewGuid().ToString(), dr["id"].ToString().Trim(), dr["Name"].ToString().Trim(), mProductionID, mWorkingSectionID, starTime, endTime, DateTime.Now.ToString(), mGroupId);
                    }
                }
            }
            else {
              //  tztable.Rows.Add(mStaffName, starTime, endTime);
                tztable.Rows.Add(System.Guid.NewGuid().ToString(), mStaffId, mStaffName, mProductionID, mWorkingSectionID, starTime, endTime, DateTime.Now.ToString(), mGroupId);
                   
            }
            //table.Columns.Add("KeyId", typeof(string));
            //table.Columns.Add("StaffID", typeof(string));
            //table.Columns.Add("mStaffName", typeof(string));
            //table.Columns.Add("OrganizationID", typeof(string));
            //table.Columns.Add("WorkingSectionID", typeof(string));
            //table.Columns.Add("StartTime", typeof(string));
            //table.Columns.Add("EndTime", typeof(string));
            //table.Columns.Add("TimeStamp", typeof(string));
            //table.Columns.Add("GroupId", typeof(string));   
          
            //一名员工的情况  获取 [assessment_ShiftAssessmentResultDetail] 表
            //if (Convert.ToInt32(mStaffId)!=0) { 
            //    //获取某个员工的签到时间
            //  DataTable myWorkingTimeTable =GetStaffSignInTimeList(mProductionID, mWorkingSectionID, mStaffId, starTime, endTime);
            //   //获取岗位考核项
            //  DataTable myAssessmentItemsTable = GetStaffAssessmentItems(mVersionId);

            //  DataTable m_AssessmentTable = Test.GetStaffAssessment(myWorkingTimeTable, myAssessmentItemsTable);
            //}
            // return table; 
            return tztable;                
        }
        //public static DataTable GetStaffAssessmentCalculateResult(string mProductionID, string mWorkingSectionID, string mStaffId, string mStaffName, string mGroupName, string mGroupId, string mStartTime, string mVersionId, string mStatisticalCycle) 
        //{
        //    DataTable table = new DataTable();

        //    return table;
        //}
        public static DataTable GetStaffAssessmentCalculateResult(DataTable tzTable, string mVersionId, string mStatisticalCycle)
        {

            //mVersionId,        7
            //mStatisticalCycle  8
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

            //tzTable字段
            //table.Columns.Add("KeyId", typeof(string));
            //table.Columns.Add("StaffID", typeof(string));
            //table.Columns.Add("mStaffName", typeof(string));
            //table.Columns.Add("OrganizationID", typeof(string));
            //table.Columns.Add("WorkingSectionID", typeof(string));
            //table.Columns.Add("StartTime", typeof(string));
            //table.Columns.Add("EndTime", typeof(string));
            //table.Columns.Add("TimeStamp", typeof(string));
            //table.Columns.Add("GroupId", typeof(string));      
            DataTable table = new DataTable();
            string mKeyId = "";
            string mProductionID="";
            string mWorkingSectionID = "";
            string mStaffId = "";
            string starTime = "";
            string endTime = "";



            DataTable myAssessmentItemsTable = GetStaffAssessmentItems(mVersionId);
            DataTable m_AssessmentTable = new DataTable();
            //DataTable m_AssessmentTable = myAssessmentItemsTable.Clone();
            for (int i = 0; i < tzTable.Rows.Count; i++)
            {
                //DataTable myWorkingTimeTable, DataTable myAssessmentItemsTable
                //   1.获取员工工作时间段表    2 .考核项表
                mKeyId = tzTable.Rows[i]["KeyId"].ToString();
                mProductionID = tzTable.Rows[i]["OrganizationID"].ToString();
                mWorkingSectionID = tzTable.Rows[i]["WorkingSectionID"].ToString();
                mStaffId = tzTable.Rows[i]["StaffID"].ToString();
                starTime = tzTable.Rows[i]["StartTime"].ToString();
                endTime = tzTable.Rows[i]["EndTime"].ToString();
                DataTable myWorkingTimeTable = GetStaffSignInTimeList( mProductionID,mWorkingSectionID,mStaffId,starTime,endTime );

                DataTable mAssessmentTable = Test.GetStaffAssessment(myWorkingTimeTable, myAssessmentItemsTable);
                //for (int j = 0; j < mAssessmentTable.Rows.Count;j++ )
                //{
                foreach(DataRow dr in mAssessmentTable.Rows){
                   dr["KeyId"]=mKeyId;          
                }
                m_AssessmentTable.Merge(mAssessmentTable);
            }
            m_AssessmentTable.Columns.Add("AssessmentName", typeof(string));
            DataTable AssessmentCatalogueTable =GetAssessmentCatalogue();

            for (int i = 0; i < m_AssessmentTable.Rows.Count;i++ )
            {
                for (int j = 0; j < AssessmentCatalogueTable.Rows.Count;j++ )
                {

                    if (m_AssessmentTable.Rows[i]["AssessmentId"].ToString().Trim().Equals(AssessmentCatalogueTable.Rows[j]["AssessmentId"].ToString().Trim()))
                    {
                        m_AssessmentTable.Rows[i]["AssessmentName"] = AssessmentCatalogueTable.Rows[j]["Name"];              
                    }
                }
            }
            return m_AssessmentTable; 
        }
        private static DataTable GetAssessmentCatalogue()
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT  [AssessmentId]
                                  ,[Name]
                                  ,[Type]
                                  ,[ValueType]
                                  ,[Enabled]
                                  ,[Creator]
                                  ,[CreateTime]
                                  ,[Remark]
                              FROM [dbo].[assessment_AssessmentCatalogue]
                              where [Enabled]=1";

            DataTable AssessmentCatalogueTable = factory.Query(mySql);
            return AssessmentCatalogueTable;           
        }
        private static DataTable tztableStructrue() 
        {                  
            DataTable table = new DataTable();
            table.Columns.Add("KeyId", typeof(string));
            table.Columns.Add("StaffID", typeof(string));
            table.Columns.Add("mStaffName", typeof(string));
            table.Columns.Add("OrganizationID", typeof(string));
            table.Columns.Add("WorkingSectionID", typeof(string));
            table.Columns.Add("StartTime", typeof(string));
            table.Columns.Add("EndTime", typeof(string));
            table.Columns.Add("TimeStamp", typeof(string));
            table.Columns.Add("GroupId", typeof(string));      
            return table;           
        }
        private static DataTable tableStructure() 
        {
            DataTable table = new DataTable();
            table.Columns.Add("mStaffName", typeof(string));
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
        /// <summary>
        /// 获取某个员工的签到时间
        /// </summary>
        /// <returns></returns>
        private static DataTable GetStaffSignInTimeList(string mProductionID,string mWorkingSectionID,string mStaffId,string starTime,string endTime ) 
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT convert(datetime,A.vDate+' '+B.[StartTime]) as StartTime
	                              ,convert(datetime,A.vDate+' '+B.[EndTime]) as EndTime
                              FROM [dbo].[shift_staffSignInRecord] A,
                                   [dbo].[system_WorkingSectionShiftDescription] B
                              where A.[WorkingSectionID]=B.[WorkingSectionID]
                              and A.[Shifts]=B.[Shifts]
                              and A.[OrganizationID]=@mProductionID
                              and A.[WorkingSectionID]=@mWorkingSectionID
                              and A.[StaffID]=@mStaffId
                              and convert(datetime,A.[vDate])>=convert(datetime,@starTime)
                              and convert(datetime,A.[vDate])<=convert(datetime,@endTime)";
            SqlParameter[] para = { 
                                      new SqlParameter("@mProductionID", mProductionID) ,
                                      new SqlParameter("@mWorkingSectionID", mWorkingSectionID) ,
                                      new SqlParameter("@mStaffId", mStaffId) ,
                                      new SqlParameter("@starTime", starTime) ,
                                      new SqlParameter("@endTime", endTime) 
                                  };
            DataTable mSignInTime = factory.Query(mySql, para);
            return mSignInTime;            
        }
        /// <summary>
        /// 获取岗位考核项
        /// </summary>
        /// <param name="mKeyId"></param>
        /// <returns></returns>
        public static DataTable GetStaffAssessmentItems(string mKeyId) 
        {
            string connectionString = ConnectionStringFactory.NXJCConnectionString;
            ISqlServerDataFactory factory = new SqlServerDataFactory(connectionString);
            string mySql = @"SELECT [Id]
                              ,[AssessmentId]
                              ,[ObjectId]
                              ,[OrganizaitonID]
                              ,[KeyId]
                              ,[WeightedValue]
                              ,[BestValue]
                              ,[WorstValue]
                              ,[Enabled]
                          FROM [dbo].[assessment_AssessmentDetail]
                              where Enabled=1
                              and KeyId=@mKeyId
                            group by [AssessmentId],[ObjectId]
                              ,[OrganizaitonID]
                              ,[KeyId],[Id] ,[WeightedValue]
                              ,[BestValue]
                              ,[WorstValue]
                              ,[Enabled]";
            SqlParameter para = new SqlParameter("@mKeyId", mKeyId);
            DataTable mAssessmentItems = factory.Query(mySql, para);
            return mAssessmentItems;   
        }
    }
}
