<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="StaffAssessmentResultDetial.aspx.cs" Inherits="StaffAssessment.Web.UI_StaffAssessment.StaffAssessmentResultDetial" %>
<%@ Register Src="/UI_WebUserControls/OrganizationSelector/OrganisationTree.ascx" TagName="OrganisationTree" TagPrefix="uc1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <link rel="stylesheet" type="text/css" href="/lib/ealib/themes/gray/easyui.css"/>
	<link rel="stylesheet" type="text/css" href="/lib/ealib/themes/icon.css"/>
    <link rel="stylesheet" type="text/css" href="/lib/extlib/themes/syExtIcon.css"/>
    <link rel="stylesheet" type="text/css" href="/lib/extlib/themes/syExtCss.css"/>

	<script type="text/javascript" src="/lib/ealib/jquery.min.js" charset="utf-8"></script>
	<script type="text/javascript" src="/lib/ealib/jquery.easyui.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="/lib/ealib/easyui-lang-zh_CN.js" charset="utf-8"></script>

    <script type="text/javascript" src="/lib/ealib/extend/jquery.PrintArea.js" charset="utf-8"></script> 
    <script type="text/javascript" src="/lib/ealib/extend/jquery.jqprint.js" charset="utf-8"></script>
    <!--[if lt IE 8 ]><script type="text/javascript" src="/js/common/json2.min.js"></script><![endif]-->
    <script type="text/javascript" src="/js/common/PrintFile.js" charset="utf-8"></script> 

    <script type="text/javascript" src="js/page/StaffAssessmentResultDetial.js" charset="utf-8"></script>
</head>
<body>
    <div id="cc" class="easyui-layout"data-options="fit:true,border:false" >    
         <div data-options="region:'west',split:true" style="width: 230px;">
            <uc1:OrganisationTree ID="OrganisationTree_ProductionLine" runat="server" />
        </div>
          <div id="toorBar" title="" style="height:56px;padding:10px;">
            <div> 
                <table>
                    <tr>
                          <td>组织机构:</td>
                        <td >                               
                            <input id="organizationName" class="easyui-textbox" readonly="readonly"style="width:120px" />               
                       </td>    
                         <td>岗位:</td>
                        <td >                               
                           <input class="easyui-combogrid" type="text" id="workingSection" style="width:85px" />                 
                        </td>  
                           <td>产线:</td> 
                        <td >                               
                            <input class="easyui-textbox" id="productionName" readonly="readonly"  style="width:120px"/>            
                        </td>                                  
                        </tr>
                    </table>  
                    <table>
                        <tr>

                               <%--<td>开始时间：</td>--%>
                        <td>考核组：</td>
                        <td>                           
                            <input id="AssessmentGroup" class="easyui-combogrid" required="required" style="width:70px"/>                   
                        </td>
                         <td>周期：</td>
                         <td>                           
                            <%--<input id="AssessmentCycle" type="text" class="easyui-textbox" readonly="readonly" style="width:40px"/>--%>  
                               <input class="easyui-textbox" id="AssessmentCycle" readonly="readonly"  style="width:40px"/>                          
                        </td>
                  

                            <%--年份--%>                        
                        <td class="myear">
                            <input id="date_year" type="text" class="easyui-combobox"  required="required" style="width:80px"/>
                        </td>
                        <%--月份--%>              
                        <td class="mmonth">
                                <input id="date_smonth" type="text" class="easyui-combobox" required="required" style="width:80px"/>
                        </td>  
                         <td class="mmonth">
                                <input id="date_emonth" type="text" class="easyui-combobox" required="required" style="width:80px"/>
                        </td>                           
                        <%--日期--%>
                        <td class="mday">
                            <input id="date_sday" type="text" class="easyui-datebox" required="required" style="width:100px"/>
                        </td>
                        <td class="mday">
                            <input id="date_eday" type="text"  class="easyui-datebox" required="required" style="width:100px"/>
                        </td>
                        <%-- <td>考核版本：</td>
                         <td>                           
                            <input id="AssessmentVersion" class="easyui-combobox" required="required" style="width:80px"/>                   
                        </td>--%>
                         <td>
                            <a id="btn" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'" onclick="Query()">查询</a>
                        </td>
                    </tr>
                </table>         
            </div>
	    </div> 
         <div data-options="region:'center'" style="padding:5px;background:#eee;">
             <table id="grid_Main"class="easyui-datagrid"></table>
         </div>
    </div>
 	  
     <!-- 编辑窗口开始 -->
            <div id="AssessmentResultDetailTable" class="easyui-window" title="员工考核结果详表" data-options="modal:true,closed:true,iconCls:'icon-search',minimizable:false,maximizable:false,collapsible:false,resizable:false" style="width:400px;height:300px">
	    	 <div  class="easyui-layout"data-options="fit:true,border:false" >   
                 <div id="DetailtoorBar" style="height:28px;">
                    <div>
                        <table>
                            <tr>
                                  <td>员工:</td>
                                <td >                               
                                    <input id="display_StaffName" class="easyui-textbox" readonly="readonly"style="width:65px" />               
                               </td>    
                                 <td>考核日期:</td>
                                <td >                               
                                   <input class="easyui-textbox" id="display_Date" readonly="readonly"  style="width:80px"/>                
                                </td>                           
                                </tr>
                            </table>  
                        </div>
                  </div>
                  <div data-options="region:'center'" style="padding:5px;background:#eee;">
                     <table id="grid_MainDetail"class="easyui-datagrid"></table>
                 </div>
                </div>
            </div>
            <!-- 编辑窗口开始 -->
</body>
</html>
