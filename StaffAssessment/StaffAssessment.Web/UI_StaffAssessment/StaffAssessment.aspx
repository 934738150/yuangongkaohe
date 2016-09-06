<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="StaffAssessment.aspx.cs" Inherits="StaffAssessment.Web.UI_StaffAssessment.StaffAssessment" %>

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

    <script type="text/javascript" src="js/page/StaffAssessment.js" charset="utf-8"></script>
</head>
<body>
    <div class="easyui-layout"data-options="fit:true,border:false" >    
         <div data-options="region:'west',split:true" style="width: 230px;">
            <uc1:OrganisationTree ID="OrganisationTree_ProductionLine" runat="server" />
         </div>
         <div data-options="region:'center',fit:true,border:false"style="padding:5px;background:#eee;">
              <div class="easyui-layout"data-options="fit:true,border:false" > 
                   <div data-options="region:'north',split:true,border:false" style="height: 82px;">
                     <div  style="height:180px;padding:10px;">                         
                                  <table>
                                     <tr>
                                          <td style="width:60px">组织机构:</td>
                                        <td >                               
                                            <input id="organizationName" class="easyui-textbox" readonly="readonly"style="width:80px" />               
                                       </td>    
                        <%--             </tr>
                                       </table>
                                  <table>
                                      <tr>--%>
                                         <td style="width:40px">岗位:</td>
                                        <td >                               
                                           <input class="easyui-combogrid" type="text" id="workingSection" style="width:80px" />                 
                                        </td>  
                                           <td>产线:</td>
                                        <td >                               
                                            <input class="easyui-textbox" id="productionName"readonly="readonly"  style="width:80px"/>            
                                        </td>  
                                         <td style="width:60px">考核版本：</td>
                                         <td>                           
                                            <input id="AssessmentVersion" class="easyui-combobox" style="width:80px"/>                   
                                        </td>
                                           </tr>
                                   </table>
                                  <table>
                                    <tr>
                                         <td style="width:60px">考核组：</td>
                                            <td>                           
                                                <input id="AssessmentGroup" class="easyui-combogrid" required="required" style="width:80px"/>                   
                                            </td>
                                         <td style="width:60px">考核周期：</td>
                                         <td>                           
                                            <input id="AssessmentCycle" class="easyui-textbox" readonly="readonly" style="width:40px"/>                   
                                        </td>                               
                                            <%--年份--%>                        
                                       <td class="myear">
                                            <input id="date_year" type="text" class="easyui-combobox"  required="required" style="width:80px"/>
                                        </td>
                                        <%--月份--%>              
                                        <td class="mmonth">
                                                <input id="date_smonth" type="text" class="easyui-combobox" required="required" style="width:80px"/>
                                        </td>                           
                                        <%--日期--%>
                                        <td class="mday">
                                            <input id="date_sday" type="text" class="easyui-datebox" required="required" style="width:100px"/>
                                        </td>
                                        <td class="mday">
                                            <input id="date_eday" type="text"  class="easyui-datebox" required="required" style="width:100px"/>
                                        </td>    
                                         <td>员工:</td>
                                         <td >                               
                                            <input id="Staff" class="easyui-combobox" style="width:80px" />               
                                        </td>                       
                                         <td style="left:80px">
                                            <a id="calculator" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-calculator'" onclick="Calculate()">计算</a>
                                        </td>
                                         <td>
                                            <a id="btn" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-save'" onclick="Query()">全部保存</a>
                                        </td>
                                    </tr>
                                </table>                       
	                           </div>                 
                   </div>
                   <div data-options="region:'center',border:false">
                        <div class="easyui-layout"data-options="fit:true,border:false" >                      
                              <div data-options="region:'west',split:true,border:false" style="width:400px">
                                 <table id="grid_Main"class="easyui-datagrid"></table>
                             </div>
                              <div data-options="region:'center',border:false">
                                  <table id="grid_resultDetail"class="easyui-datagrid"></table>
                            </div>
                        </div>
                   </div>                
              </div>
         </div>         
    </div>  
</body>
</html>
