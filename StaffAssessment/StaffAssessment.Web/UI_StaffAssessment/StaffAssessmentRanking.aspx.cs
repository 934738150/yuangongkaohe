using StaffAssessment.Service;
using StaffAssessment.Service.StaffAssessment;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StaffAssessment.Web.UI_StaffAssessment
{
    public partial class StaffAssessmentRanking : WebStyleBaseForEnergy.webStyleBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            base.InitComponts();
            if (!IsPostBack)
            {
#if DEBUG
                ////////////////////调试用,自定义的数据授权
                List<string> m_DataValidIdItems = new List<string>() { "zc_nxjc_byc_byf" };
                AddDataValidIdGroup("ProductionOrganization", m_DataValidIdItems);
#elif RELEASE
#endif
                this.OrganisationTree_ProductionLine.Organizations = GetDataValidIdGroup("ProductionOrganization");                         //向web用户控件传递数据授权参数
                this.OrganisationTree_ProductionLine.PageName = "StaffAssessmentRanking.aspx";   //向web用户控件传递当前调用的页面名称
                this.OrganisationTree_ProductionLine.LeveDepth = 5;
            }
        }
        [WebMethod]
        public static string GetWorkingSectionGrid(string mOrganizationId)
        {
            DataTable table = commonClass.GetWorkingSectionGridList(mOrganizationId);
            string json = EasyUIJsonParser.DataGridJsonParser.DataTableToJson(table);
            return json;
        }
        [WebMethod]
        public static string GetAssessmentGroupGrid()
        {
            DataTable table = commonClass.GetAssessmentGroupGridTable();
            string json = EasyUIJsonParser.DataGridJsonParser.DataTableToJson(table);
            return json;
        }
        //[WebMethod]
        //public static string GetAssessmentVersion(string mOrganizationID, string mWorkingSectionID)
        //{
        //    DataTable table = StaffAssessmentService.GetAssessmentVersionTable(mOrganizationID, mWorkingSectionID);
        //    string json = EasyUIJsonParser.DataGridJsonParser.DataTableToJson(table);
        //    return json;
        //}
       // [WebMethod]
       // public static string GetAssessmentResultByDay(string mProductionID, string mWorkingSectionID, string mStaffId, string mGroupId, string mStartTime, string mEndTime, string mVersionId, string mStatisticalCycle)
       //{
       //    DataTable table = StaffAssessmentRankingService.GetAssessmentResultTableByDay(mProductionID, mWorkingSectionID, mStaffId, mGroupId, mStartTime, mEndTime, mVersionId, mStatisticalCycle);
       //     string json = EasyUIJsonParser.DataGridJsonParser.DataTableToJson(table);
       //     return json;
       // }

        [WebMethod]
        public static string GetAssessmentResultColumnsJson(string mProductionID, string mWorkingSectionID, string mGroupId, string mStartTime, string mEndTime, string mStatisticalCycle)
        {
            string json = StaffAssessmentRankingService.GetGenerationTableTemplateColumnsJson(mProductionID, mWorkingSectionID, mGroupId, mStartTime, mEndTime, mStatisticalCycle);
            return json;
        }

        [WebMethod]
        public static string GetAssessmentResult(string mProductionID, string mWorkingSectionID, string mGroupId, string mStartTime, string mEndTime,  string mStatisticalCycle)
        {
            DataTable table = StaffAssessmentRankingService.GetAssessmentResultTable(mProductionID, mWorkingSectionID, mGroupId, mStartTime, mEndTime,  mStatisticalCycle);
            string json = EasyUIJsonParser.DataGridJsonParser.DataTableToJson(table);
            return json;
        }
    }
}