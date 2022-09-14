import { Controller, Get, Req, Res } from "@nestjs/common";
import { Response } from "express";
import Request from "../../types/Request";

@Controller()
class StaticController {
  @Get("/")
  public home(@Req() req: Request, @Res() res: Response): void {
    res.render("home");
  }
}

export default StaticController;
